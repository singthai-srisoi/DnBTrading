<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { enterToNext } from '$lib/actions/enterToNext';
	import * as Field from '$lib/components/ui/field/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { insertInventory, updateInventory } from '$lib/remote/inventory.remote';
	import { getLastSelectedUnit } from '$lib/remote/lastselectedunit.remote';
	import { untrack } from 'svelte';
	import { toast } from 'svelte-sonner';
	import type { inventoriesInventory } from '$lib/server/schema';
	import { CalendarDate, parseDate } from '@internationalized/date';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import { listVehicleOptions } from '$lib/remote/vehicle.remote';
	import { listPersonOptions } from '$lib/remote/person.remote';
	import { listProductOptions } from '$lib/remote/product.remote';
	import ComboBox from '$lib/components/ComboBox.svelte';
	import Decimal from 'decimal.js';
	import PersonComboBox from './PersonComboBox.svelte';

	interface Props {
		inventory?: typeof inventoriesInventory.$inferSelect | null;
		submited?: (data: unknown) => void;
		cancel?: () => void;
	}
	/**export const inventoriesInventory = pgTable(
		'inventories_inventory',
		{
			id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
			date: date().notNull(),
			customerTicketNo: varchar('customer_ticket_no', { length: 100 }),
			supplierQty: doublePrecision('supplier_qty').notNull(),
			ticketNo: varchar('ticket_no', { length: 100 }).notNull(),
			do: varchar({ length: 100 }).notNull(),
			weightIn: doublePrecision('weight_in').notNull(),
			weightOut: doublePrecision('weight_out').notNull(),
			factoryNett: doublePrecision('factory_nett'),
			deduction: doublePrecision(),
			bucket: doublePrecision(),
			remark: varchar({ length: 255 }),
			customerId: bigint('customer_id', { mode: 'number' }).references(() => personPerson.id),
			driverId: bigint('driver_id', { mode: 'number' }).references(() => personPerson.id),
			productId: bigint('product_id', { mode: 'number' }).references(() => productsProduct.id),
			supplierId: bigint('supplier_id', { mode: 'number' }).references(() => personPerson.id),
			vehicleId: bigint('vehicle_id', { mode: 'number' }).references(() => vehiclesVehicle.id),
			nett: doublePrecision(),
			unit: varchar({ length: 10 }).notNull()
		}, */

	let {
		inventory = {
			id: 0,
			date: '',
			customerTicketNo: '',
			supplierQty: 0,
			ticketNo: '',
			do: '',
			weightIn: 0,
			weightOut: 0,
			factoryNett: 0,
			deduction: 0,
			bucket: 0,
			remark: '',
			customerId: 0,
			driverId: 0,
			productId: 0,
			supplierId: 0,
			vehicleId: 0,
			nett: 0,
			unit: ''
		},
		submited,
		cancel
	}: Props = $props();

	let editForm = $derived(updateInventory.for(inventory?.id ?? 0));
	let formFunction = $derived(inventory?.id ? editForm : insertInventory);
	const fieldId = $props.id();
	let lastUnit = $derived(await getLastSelectedUnit());

	// #region Options
	let date_ = $state<CalendarDate | undefined>();
	let vehicleId_ = $state<number | undefined>();
	let driverId_ = $state<number | undefined>();
	let supplierId_ = $state<number | undefined>();
	let customerId_ = $state<number | undefined>();
	let productId_ = $state<number | undefined>();
	let unit_ = $state<'kg' | 'ton' | undefined>();

	let vehicleOptionsQuery = async () => {
		let vehicles = await listVehicleOptions();
		return vehicles.map((vehicle) => ({
			value: vehicle.id,
			label: `${vehicle.regNo} ${vehicle.model}`
		}));
	};
	let vehicleOptions = $derived(await vehicleOptionsQuery());

	// let driverOptionsQuery = async () => {
	// 	let drivers = await listPersonOptions({ type: 'driver' });
	// 	return drivers.map((driver) => ({
	// 		value: driver.id,
	// 		label: `${driver.code} - ${driver.name}`
	// 	}));
	// };
	// let driverOptions = $derived(await driverOptionsQuery());

	// let supplierOptionsQuery = async () => {
	// 	let suppliers = await listPersonOptions({ type: 'supplier' });
	// 	return suppliers.map((supplier) => ({
	// 		value: supplier.id,
	// 		label: `${supplier.code} - ${supplier.name}`
	// 	}));
	// };
	// let supplierOptions = $derived(await supplierOptionsQuery());

	let customerOptionsQuery = async () => {
		let customers = await listPersonOptions({ type: 'customer' });
		return customers.map((customer) => ({
			value: customer.id,
			label: `${customer.code} - ${customer.name}`
		}));
	};
	let customerOptions = $derived(await customerOptionsQuery());

	let productOptionsQuery = async () => {
		let products = await listProductOptions();
		return products.map((product) => ({
			value: product.id,
			label: `${product.code} - ${product.name}`
		}));
	};
	let productOptions = $derived(await productOptionsQuery());

	const unitOptions = [
		{ value: 'kg', label: 'Kilogram' },
		{ value: 'ton', label: 'Ton' }
	];
	// #endregion Options

	$effect(() => {
		if (!inventory) return;

		let {
			id,
			date,
			customerTicketNo,
			supplierQty,
			ticketNo,
			do: do_,
			weightIn,
			weightOut,
			factoryNett,
			deduction,
			bucket,
			remark,
			customerId,
			driverId,
			productId,
			supplierId,
			vehicleId,
			nett,
			unit
		} = inventory;
		customerTicketNo = customerTicketNo ?? '';
		factoryNett = factoryNett ?? 0;
		deduction = deduction ?? 0;
		bucket = bucket ?? 0;
		remark = remark ?? '';
		customerId = customerId ?? 0;
		driverId = driverId ?? 0;
		productId = productId ?? 0;
		supplierId = supplierId ?? 0;
		vehicleId = vehicleId ?? 0;
		nett = nett ?? 0;
		const currentForm = formFunction;
		untrack(() => {
			const defaultUnit = unit === 'kg' || unit === 'ton' ? unit : lastUnit;
			currentForm.fields.set({
				...(id ? { id } : {}),
				date,
				customerTicketNo,
				supplierQty,
				ticketNo,
				do: do_,
				weightIn,
				weightOut,
				factoryNett,
				deduction,
				bucket,
				remark,
				customerId,
				driverId,
				productId,
				supplierId,
				vehicleId,
				nett,
				unit: defaultUnit
			});
			date_ = date ? parseDate(date) : undefined;
			vehicleId_ = vehicleId || undefined;
			driverId_ = driverId || undefined;
			supplierId_ = supplierId || undefined;
			customerId_ = customerId || undefined;
			productId_ = productId || undefined;
			unit_ = defaultUnit;
		});
	});

	// Auto-calculate factory nett and nett whenever weight in/out or deduction change,
	// using Decimal.js to avoid floating point rounding issues. Works for both insert and edit
	// since it reacts to whichever form (insert/edit) is currently active.
	$effect(() => {
		const wIn = new Decimal(formFunction.fields.weightIn.value() || 0);
		const wOut = new Decimal(formFunction.fields.weightOut.value() || 0);
		const ded = new Decimal(formFunction.fields.deduction.value() || 0);

		const factoryNett = wIn.minus(wOut);
		const nett = factoryNett.minus(ded);

		formFunction.fields.factoryNett.set(Number(factoryNett.toFixed(3)));
		formFunction.fields.nett.set(Number(nett.toFixed(3)));
	});

	const successMessage = $derived(
		inventory?.id ? 'Inventory updated successfully!' : 'Inventory created successfully!'
	);
	const fieldLegend = $derived(inventory?.id ? 'Update Inventory' : 'Create Inventory');
</script>

<form
	use:enterToNext
	{...formFunction.enhance(async (form) => {
		try {
			const submittedUnit = new FormData(form.element).get('unit');
			const saved = await form.submit();
			if (saved) {
				form.element.reset();
				date_ = undefined;
				vehicleId_ = undefined;
				driverId_ = undefined;
				supplierId_ = undefined;
				customerId_ = undefined;
				productId_ = undefined;
				unit_ = submittedUnit === 'ton' ? 'ton' : 'kg';
				formFunction.fields.unit.set(unit_);
				getLastSelectedUnit().set(unit_);
				submited?.(form);
				toast.success(successMessage);
			} else {
				toast.error('Invalid data!');
			}
		} catch (error) {
			toast.error(
				'Oh no! Something went wrong' + (error instanceof Error ? `: ${error.message}` : ''),
				{ duration: Infinity, closeButton: true }
			);
			console.log(error);
		}
	})}
>
	{#if inventory && inventory.id}
		<input {...editForm.fields.id.as('hidden', inventory.id)} />
	{/if}

	<Field.Group class="gap-2">
		<Field.Legend>{fieldLegend}</Field.Legend>
		<!-- Ticket No. -->
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-ticket-no`}>Ticket No.</Field.Label>
			<Input
				id={`${fieldId}-ticket-no`}
				autocomplete="off"
				{...formFunction.fields.ticketNo.as('text')}
				placeholder="Enter registration number"
				class="col-span-7"
			/>
			{#each formFunction.fields.ticketNo.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<!-- Date -->
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-date`}>Date</Field.Label>
			<input
				{...formFunction.fields.date.as('date')}
				value={date_ ? date_.toString() : ''}
				hidden
			/>
			<DatePicker
				bind:value={date_}
				onchange={(value) => {
					date_ = value;
					formFunction.fields.date.set(value?.toString());
				}}
				class="col-span-5"
			/>
			{#each formFunction.fields.date.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<!-- Vehicle -->
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-vehicleId`}>Vehicle</Field.Label>
			<input {...formFunction.fields.vehicleId.as('number')} value={vehicleId_ ?? ''} hidden />
			<ComboBox
				choices={vehicleOptions}
				enterNavigation
				allowEmpty={false}
				bind:value={vehicleId_}
				placeholder="Select Vehicle"
				class="col-span-5"
			/>
			{#each formFunction.fields.vehicleId.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<!-- Driver -->
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-driverId`}>Driver</Field.Label>
			<input {...formFunction.fields.driverId.as('number')} value={driverId_ ?? ''} hidden />
			<!-- <ComboBox
				choices={driverOptions}
				enterNavigation
				allowEmpty={false}
				bind:value={driverId_}
				placeholder="Select Driver"
				class="col-span-5"
			/> -->
			<PersonComboBox type="driver" bind:value={driverId_} />
			{#each formFunction.fields.driverId.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<!-- Supplier -->
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-supplierId`}>Supplier</Field.Label>
			<input {...formFunction.fields.supplierId.as('number')} value={supplierId_ ?? ''} hidden />
			<!-- <ComboBox
				choices={supplierOptions}
				enterNavigation
				allowEmpty={false}
				bind:value={supplierId_}
				placeholder="Select Supplier"
				class="col-span-5"
			/> -->
			<PersonComboBox type="supplier" bind:value={supplierId_} />
			{#each formFunction.fields.supplierId.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<!-- Customer Ticket No. -->
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-customer-ticket-no`}>Customer Ticket No.</Field.Label>
			<Input
				id={`${fieldId}-customer-ticket-no`}
				autocomplete="off"
				{...formFunction.fields.customerTicketNo.as('text')}
				placeholder="Enter customer ticket number"
				class="col-span-7"
			/>
			{#each formFunction.fields.customerTicketNo.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<!-- Supplier Qty -->
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-supplier-qty`}>Supplier Qty</Field.Label>
			<Input
				id={`${fieldId}-supplier-qty`}
				autocomplete="off"
				{...formFunction.fields.supplierQty.as('number')}
				step="0.001"
				placeholder="Enter supplier quantity"
				class="col-span-7"
			/>
			{#each formFunction.fields.supplierQty.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<!-- Customer -->
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-customerId`}>Customer</Field.Label>
			<input {...formFunction.fields.customerId.as('number')} value={customerId_ ?? ''} hidden />
			<ComboBox
				choices={customerOptions}
				enterNavigation
				allowEmpty={false}
				bind:value={customerId_}
				placeholder="Select Customer"
				class="col-span-5"
			/>
			{#each formFunction.fields.customerId.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<!-- Product -->
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-productId`}>Product</Field.Label>
			<input {...formFunction.fields.productId.as('number')} value={productId_ ?? ''} hidden />
			<ComboBox
				choices={productOptions}
				enterNavigation
				allowEmpty={false}
				bind:value={productId_}
				placeholder="Select Product"
				class="col-span-5"
			/>
			{#each formFunction.fields.productId.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<!-- DO -->
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-do`}>DO</Field.Label>
			<Input
				id={`${fieldId}-do`}
				autocomplete="off"
				{...formFunction.fields.do.as('text')}
				placeholder="Enter DO"
				class="col-span-7"
			/>
			{#each formFunction.fields.do.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<!-- Weight In -->
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-weight-in`}>Weight In</Field.Label>
			<Input
				id={`${fieldId}-weight-in`}
				autocomplete="off"
				{...formFunction.fields.weightIn.as('number')}
				step="0.001"
				placeholder="Enter weight in"
				class="col-span-7"
			/>
			{#each formFunction.fields.weightIn.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<!-- Weight Out -->
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-weight-out`}>Weight Out</Field.Label>
			<Input
				id={`${fieldId}-weight-out`}
				autocomplete="off"
				{...formFunction.fields.weightOut.as('number')}
				step="0.001"
				placeholder="Enter weight out"
				class="col-span-7"
			/>
			{#each formFunction.fields.weightOut.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<!-- Factory Nett -->
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-factory-nett`}>Factory Nett</Field.Label>
			<Input
				id={`${fieldId}-factory-nett`}
				autocomplete="off"
				{...formFunction.fields.factoryNett.as('number')}
				step="0.001"
				placeholder="Enter factory nett"
				class="col-span-7"
			/>
			{#each formFunction.fields.factoryNett.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<!-- Deduction -->
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-deduction`}>Deduction</Field.Label>
			<Input
				id={`${fieldId}-deduction`}
				autocomplete="off"
				{...formFunction.fields.deduction.as('number')}
				step="0.001"
				placeholder="Enter deduction"
				class="col-span-7"
			/>
			{#each formFunction.fields.deduction.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<!-- Nett -->
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-nett`}>Nett</Field.Label>

			<Input
				id={`${fieldId}-nett`}
				autocomplete="off"
				{...formFunction.fields.nett.as('number')}
				step="0.001"
				placeholder="Enter nett"
				class="col-span-7"
			/>
			{#each formFunction.fields.nett.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<!-- Bucket -->
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-bucket`}>Bucket</Field.Label>
			<Input
				id={`${fieldId}-bucket`}
				autocomplete="off"
				{...formFunction.fields.bucket.as('number')}
				step="0.001"
				placeholder="Enter bucket"
				class="col-span-7"
			/>
			{#each formFunction.fields.bucket.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<!-- Remark -->
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-remark`}>Remark</Field.Label>
			<Input
				id={`${fieldId}-remark`}
				autocomplete="off"
				{...formFunction.fields.remark.as('text')}
				placeholder="Enter remark"
				class="col-span-7"
			/>
			{#each formFunction.fields.remark.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<!-- Unit -->
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-unit`}>Unit</Field.Label>
			<input {...formFunction.fields.unit.as('hidden', unit_ ?? '')} />
			<ComboBox
				choices={unitOptions}
				bind:value={unit_}
				enterNavigation
				allowEmpty={false}
				placeholder="Select a unit"
				class="col-span-7"
			/>
			{#each formFunction.fields.unit.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<Field.Field orientation="responsive">
			<Button type="submit">Submit</Button>
			<Button type="button" variant="outline" onclick={cancel}>Cancel</Button>
		</Field.Field>
	</Field.Group>
</form>

<!-- ReferenceError
<script lang="ts">
	import { createEventDispatcher } from "svelte"
    import Button from "../atoms/Button.svelte"
    import Form from "../molecule/Form.svelte"
	import TextInput from "../molecule/inputs/TextInput.svelte"
	import HiddenInput from "$components/molecule/inputs/HiddenInput.svelte"
	import SelectInputAd from "$components/molecule/inputs/SelectInputAd.svelte"
    import NumberInput from "$components/molecule/inputs/NumberInput.svelte"
    import DateInputAd from "$components/molecule/inputs/DateInputAd.svelte"
    import Decimal from "decimal.js"

    export let vehicle_options: App.SelectInputType = []
    export let driver_options: App.SelectInputType = []
    export let supplier_options: App.SelectInputType = []
    export let customer_options: App.SelectInputType = []
    export let product_options: App.SelectInputType = []

    const dispatch = createEventDispatcher()
    function submitted(event: Event) {
        dispatch("putSubmitted")
    }

    function handleButton(event: Event) {
        event.preventDefault()
        const button = event.currentTarget as HTMLButtonElement
        button.focus()
        const enterKeyEvent = new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            charCode: 13,
            bubbles: true
        })
        button.dispatchEvent(enterKeyEvent)
    }

    export let action = "?/update"
    export let data: { [key: string]: any; } = {
        id: "",
        date: "",
        vehicle: {
            label: "",
            value: "",
        },
        driver: {
            label: "",
            value: "",
        },
        supplier: {
            label: "",
            value: "",
        },
        customer_ticket_no: "",
        supplier_qty: 0,
        customer: {
            label: "",
            value: "",
        },
        product: {
            label: "",
            value: "",
        },
        ticket_no: "",
        do: "",
        weight_in: 0,
        weight_out: 0,
        factory_nett: 0,
        nett: 0,
        deduction: 0,
        bucket: 0.0,
        remark: "",
    }

    $: {
        // data.factory_nett = String((parseFloat(data.weight_in) || 0) - (parseFloat(data.weight_out) || 0))
        // data.nett = String((parseFloat(data.weight_in) || 0) - (parseFloat(data.weight_out) || 0) - (parseFloat(data.deduction) || 0))
        // data.bucket = String((parseFloat(data.deduction) || 0) / 20)
        const wIn = new Decimal(data.weight_in || 0)
        const wOut = new Decimal(data.weight_out || 0)
        const ded = new Decimal(data.deduction || 0)

        data.nett = wIn.minus(wOut).minus(ded).toFixed(3)
        data.factory_nett = wIn.minus(wOut).toFixed(3)
        data = data
    }

</script>
<Form method="post" {action} size="lg" on:submitted={submitted}>
    <h1>Inventory</h1>
    <HiddenInput name="id" value={data.id} id="inventory_form_edit_field_id" />
    <TextInput type="text" label="Ticket No" name="ticket_no" id="inventory_form_edit_field_ticket_no" value={data.ticket_no} />
    <DateInputAd label="Date" name="date" id="inventory_form_edit_field_date" value={data.date} />
    <SelectInputAd label="Vehicle" name="vehicle" id="inventory_form_edit_field_vehicle" choices={vehicle_options} actual_value={data.vehicle?.value??""} />
    <SelectInputAd label="Driver" name="driver" id="inventory_form_edit_field_driver" choices={driver_options} actual_value={data.driver?.value??""} />
    <SelectInputAd label="Supplier" name="supplier" id="inventory_form_edit_field_supplier" choices={supplier_options} actual_value={data.supplier?.value??""} />
    <TextInput type="text" label="Customer Ticket No" name="customer_ticket_no" id="inventory_form_edit_field_customer_ticket_no" value={data.customer_ticket_no} />
    <NumberInput label="Supplier Qty" name="supplier_qty" id="inventory_form_edit_field_supplier_qty" value={data.supplier_qty} step={0.001} />

    <SelectInputAd label="Customer" name="customer" id="inventory_form_edit_field_customer" choices={customer_options} actual_value={data.customer?.value??""} />
    <SelectInputAd label="Product" name="product" id="inventory_form_edit_field_product" choices={product_options} actual_value={data.product?.value??""} />
    <TextInput type="text" label="DO" name="do" id="inventory_form_edit_field_do" value={data.do} />

    <NumberInput label="Weight In" name="weight_in" id="inventory_form_edit_field_weight_in" bind:value={data.weight_in} step={0.001} />
    <NumberInput label="Weight Out" name="weight_out" id="inventory_form_edit_field_weight_out" bind:value={data.weight_out} step={0.001} />

    <NumberInput label="Factory Nett" name="factory_nett" id="inventory_form_edit_field_factory_nett" bind:value={data.factory_nett} step={0.001} />
    <NumberInput label="Deduction" name="deduction" id="inventory_form_edit_field_deduction" bind:value={data.deduction} step={0.001} />
    <NumberInput label="Nett" name="nett" id="inventory_form_edit_field_nett" bind:value={data.nett} step={0.001} />
    <NumberInput label="Bucket" name="bucket" id="inventory_form_edit_field_bucket" bind:value={data.bucket} step={0.001} />

    <TextInput type="text" label="Remark" name="remark" id="inventory_form_edit_field_remark" value={data.remark} />
    <SelectInputAd label="Unit" name="unit" id="inventory_form_field_unit" choices={[
        { label: "kilogram", value: "kg" },
        { label: "ton", value: "ton" }
    ]} actual_value={data.unit??""} />
    <Button type="submit" classes="primary" onClick={handleButton}>Submit</Button>
</Form>

-->
