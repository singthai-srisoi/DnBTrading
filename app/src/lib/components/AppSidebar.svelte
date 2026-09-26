<script lang="ts" module>
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import BotIcon from '@lucide/svelte/icons/bot';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import UserIcon from '@lucide/svelte/icons/user';
	import HomeIcon from '@lucide/svelte/icons/home';
	import TruckIcon from '@lucide/svelte/icons/truck';
	import ShoppingBasketIcon from '@lucide/svelte/icons/shopping-basket';
	// This is sample data.
	const data = {
		navMain: [
			{
				title: 'Home',
				url: '/',
				icon: HomeIcon
			},
			{
				title: 'Person',
				url: '#',
				icon: UserIcon,
				isActive: true,
				items: [
					{
						title: 'Customer',
						url: '/person/customer'
					},
					{
						title: 'Supplier',
						url: '/person/supplier'
					},
					{
						title: 'Driver',
						url: '/person/driver'
					}
				]
			},
			{
				title: 'Product',
				url: '#',
				icon: ShoppingBasketIcon,
				isActive: true,
				items: [
					{
						title: 'Product',
						url: '/product'
					},
					{
						title: 'Product Type',
						url: '/product-type'
					}
				]
			},
			{
				title: 'Vehicle',
				url: '/vehicle',
				icon: TruckIcon
			},
			{
				title: 'Inventory',
				url: '/inventory',
				icon: Settings2Icon
			}
		]
	};
</script>

<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import NavMain from './NavMain.svelte';
	import type { ComponentProps } from 'svelte';
	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<p class="text-lg font-semibold">DnB Trading</p>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
