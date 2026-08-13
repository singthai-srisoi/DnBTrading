from django.http import JsonResponse, HttpResponseBadRequest
from inventories.models import Inventory
from inventories.serializers import InventorySerializer, InventoryDataSerializer
from products.models import Product, ProductType
from vehicles.models import Vehicle
from person.models import Person
import json
import pandas as pd
import numpy as np
import datetime
from django.db.models import Q

from rest_framework import views, response, parsers
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Sum, F, Q


class ReportSchema:
    fields = InventoryDataSerializer().get_fields().keys()
    grouping = ['product', 'driver', 'supplier', 'customer', 'vehicle']
    convert_dict = {
        'id': int,
        'date': str,
        'vehicle': str,
        'vehicle__reg_no': str,
        'vehicle__model': str,
        'driver': str,
        'driver__code': 'category',
        'driver__name': 'category',
        'supplier': str,
        'supplier__code': 'category', 
        'supplier__name': 'category',
        'supplier_qty': float,
        'customer': str,
        'customer__code': 'category',
        'customer__name': 'category',
        'product': str,
        'product__code': 'category',
        'product__name': 'category',
        'ticket_no': str,
        'do': str,
        'weight_in': float,
        'weight_out': float,
        'nett': float,
        'deduction': float,
        'remark': str,
        'customer_ticket_no': str,
        'factory_nett': float,
        'bucket': float,
        'unit': str,
    }

    def get_schema(self):
        schema = {
            'start_date': '',
            'end_date': '',
            'group_by': '',
            'column_filter': [],
            'order': [],
            'fields': list(self.fields),
            'grouping': self.grouping,
            'filter_obj': {
                'product': [],
                'customer': [],
                'supplier': [],
                'driver': [],
                'vehicle': [],
            },
            'orient': 'records',
            'use_unit': '',  # default unit
        }

        return schema
    
    def get_query(self, filter):
        query = Q()

        if filter['start_date']:
            query = query & Q(date__gte=filter['start_date'])
        if filter['end_date']:
            query = query & Q(date__lte=filter['end_date'])

        if filter['filter_obj']:
            if filter['filter_obj']['product']:
                query = query & ~Q(product__id__in=filter['filter_obj']['product'])
            if filter['filter_obj']['vehicle']:
                query = query & ~Q(vehicle__id__in=filter['filter_obj']['vehicle'])
            if filter['filter_obj']['supplier']:
                query = query & ~Q(supplier__id__in=filter['filter_obj']['supplier'])
            if filter['filter_obj']['driver']:
                query = query & ~Q(driver__id__in=filter['filter_obj']['driver'])
            if filter['filter_obj']['customer']:
                query = query & ~Q(customer__id__in=filter['filter_obj']['customer'])

        return query

def scale_column(df, col_name, target_unit):
    """
    Scales a column based on unit conversion logic:
    - ton -> kg : * 1000
    - kg -> ton : / 1000
    """
    if col_name not in df.columns or 'unit' not in df.columns:
        return df[col_name]

    is_ton_to_kg = (df['unit'] == 'ton') & (target_unit == 'kg')
    is_kg_to_ton = (df['unit'] == 'kg') & (target_unit == 'ton')

    # Default factor is 1.0 (no conversion)
    factors = np.ones(len(df), dtype=float)
    factors[is_ton_to_kg] = 1000.0
    factors[is_kg_to_ton] = 1 / 1000.0

    return df[col_name] * factors

def recalculate_weight_columns(df):
    if 'weight_in' not in df.columns or 'weight_out' not in df.columns:
        return df

    weight_in = df['weight_in'].astype(float)
    weight_out = df['weight_out'].astype(float)
    factory_nett = weight_in - weight_out

    if 'factory_nett' in df.columns:
        df['factory_nett'] = factory_nett

    if 'nett' in df.columns:
        deduction = df['deduction'].astype(float) if 'deduction' in df.columns else 0.0
        df['nett'] = factory_nett - deduction

    return df

def apply_unit_conversion(df, target_unit):
    if not target_unit or 'unit' not in df.columns:
        return df

    weight_columns = ['weight_in', 'weight_out', 'factory_nett', 'nett', 'deduction']
    for col in weight_columns:
        if col in df.columns:
            df[col] = scale_column(df, col, target_unit)

    df.drop(columns=['unit'], inplace=True)
    return df

def recalculate_grouped_nett(df):
    if 'factory_nett' not in df.columns or 'deduction' not in df.columns or 'nett' not in df.columns:
        return df

    df['nett'] = df['factory_nett'].astype(float) - df['deduction'].astype(float)
    return df

class ReportDataViewSet(views.APIView, ReportSchema):
    # authentication_classes = [IsAuthenticated]
    permission_classes = (IsAuthenticated, )
    
    def get(self, request):
        schema = self.get_schema()

        return response.Response(schema)



    def post(self, request):
        filter = request.data
        print("filter:", filter)
        print('use_unit', filter.get('use_unit', None))
        query = self.get_query(filter)

        queryset = Inventory.objects.filter(query)
        if queryset.count() == 0:
            return response.Response({"message": "No data found", "count": 0, "data": []}, status=200)

        context = { 'fields': filter['fields'] }
        serializer = InventoryDataSerializer(data=queryset, many=True, context=context)
        serializer.is_valid()
        da = serializer.data

        convert_dict_filtered = {k: self.convert_dict[k] 
            for k in self.convert_dict 
            if k in filter['fields'] 
        }
        df = pd.DataFrame(da)
        # print(df.columns)
        # replace non and None
        df.replace({np.nan: None}, inplace=True)
        df.replace([None], [''], inplace=True)
        if 'nett' in df.columns:
            df['nett'] = df['nett'].replace([''], [0])
        # cast type
        
        # print(convert_dict_filtered)
        df = df.astype(convert_dict_filtered)
        if unit := filter.get('use_unit', None):
            df = apply_unit_conversion(df, unit)
        df = recalculate_weight_columns(df)

        group_by = filter['group_by']
        # print(group_by)
        if group_by and group_by in self.grouping:
            agg = pd.DataFrame(df.groupby(group_by).agg({
                'factory_nett': 'sum', 
                'bucket': 'sum', 
                'nett': 'sum',
                'deduction': 'sum',
            }))
            agg_sum = pd.DataFrame(agg.sum())
            total = pd.concat([agg, agg_sum.T]).rename(index={0: 'Total'})
            total["sort"] = "1"

            indexed = df.set_index(group_by)
            indexed['sort'] = "0"

            final = pd.concat([indexed,total]).reset_index(names=[group_by]).sort_values(by=[group_by,'sort','id'])
            final.drop(columns=['sort', 'id'], inplace=True)
            final.replace({np.nan: ''}, inplace=True)

            df = final

        orient = filter.get('orient', 'records')      
        if 'id' in df.columns:
            df.sort_values(by='id', inplace=True)
            df.drop(columns=['id'], inplace=True)
            
        # if unit := filter.get('use_unit', None):
        #     weight_columns = ['weight_in', 'weight_out', 'factory_nett', 'nett', 'deduction']
        #     for col in weight_columns:
        #         if col in df.columns:
        #             df[col] = scale_column(df, col, unit)
        #     # drop column unit
        #     print("Dropping column 'unit' from DataFrame")
        #     df.drop(columns=['unit'], inplace=True)
                    
        df_json = df.to_dict(orient=orient)
        # df_csv = df.to_csv(index=False)

        return response.Response({"message": "success", "count": queryset.count(), "data": df_json}, status=200)
    
class HomePageOverviewViewSet(views.APIView, ReportSchema):
    # authentication_classes = [IsAuthenticated]
    permission_classes = (IsAuthenticated, )
    
    def get(self, request):
        schema = self.get_schema()
        return response.Response(schema)

    def post(self, request):
        filter = request.data
        query = self.get_query(filter)

        queryset = Inventory.objects.filter(query)
        if queryset.count() == 0:
            return response.Response({"message": "No data found", "count": 0, "data": []}, status=200)

        context = { 'fields': filter['fields'] }
        serializer = InventoryDataSerializer(data=queryset, many=True, context=context)
        serializer.is_valid()
        da = serializer.data

        convert_dict_filtered = {k: self.convert_dict[k] 
            for k in self.convert_dict 
            if k in filter['fields'] 
        }
        df = pd.DataFrame(da)
        # print(df.columns)
        # Preprocess data
        df.replace({np.nan: None}, inplace=True)
        df.replace([None], [''], inplace=True)
        if 'nett' in df.columns:
            df['nett'] = df['nett'].replace([''], [0])
        df = df.astype(convert_dict_filtered)
        if unit := filter.get('use_unit', None):
            df = apply_unit_conversion(df, unit)
        df = recalculate_weight_columns(df)

        group_by = filter['group_by']
        # print(group_by)
        if group_by and group_by in self.grouping:
            final = pd.DataFrame(df.groupby(group_by).agg({
                'factory_nett': 'sum', 
                'bucket': 'sum', 
                'nett': 'sum',
                'deduction': 'sum',
            })).reset_index()
            final = recalculate_grouped_nett(final)
            df = final

        orient = filter.get('orient', 'records')
        df_json = df.to_dict(orient=orient)
        # df_csv = df.to_csv(index=False)

        return response.Response({"message": "success", "count": queryset.count(), "data": df_json}, status=200)