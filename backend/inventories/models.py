from django.db import models
from products.models import Product
from vehicles.models import Vehicle
from person.models import Person

# Create your models here.
class Inventory(models.Model):
    date = models.DateField()
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True)
    driver = models.ForeignKey(
        Person, 
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'type': 'driver'},
        related_name='driver')
    supplier = models.ForeignKey(
        Person, 
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'type': 'supplier'},
        related_name='supplier')
    
    customer_ticket_no = models.CharField(max_length=100, null=True, blank=True) # customer ticket no

    supplier_qty = models.IntegerField(default=0)
    customer = models.ForeignKey(
        Person, 
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={'type': 'customer'},
        related_name='customer')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    ticket_no = models.CharField(max_length=100, unique=True)
    do = models.CharField(max_length=100)
    weight_in = models.IntegerField(default=0)
    weight_out = models.IntegerField(default=0)

    factory_nett = models.IntegerField(default=0, null=True, blank=True) # weight_in - weight_out
    nett = models.IntegerField(default=0, null=True, blank=True) # factory_nett - deduction

    deduction = models.IntegerField(default=0, null=True, blank=True)

    bucket = models.FloatField(default=0.0, null=True, blank=True) # deduction / 20

    # new added fields
    # customer_ticket_no, factory_nett, bucket
    # factory_nett = weight_in - weight_out
    # bucket = deduction / 20

    remark = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return f'{self.ticket_no} - {self.do}'