<script lang="ts">
	import MenuIcon from '@lucide/svelte/icons/menu';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { signOut } from '$lib/remote/auth.remote';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	let { data, children } = $props();

	let mobileNavOpen = $state(false);
	let signingOut = $state(false);

	let handleSignOut = async () => {
		signingOut = true;
		try {
			await signOut();
			toast.success('Signed out successfully');
			goto('/login');
		} catch (error) {
			console.error(error);
			toast.error('Failed to sign out');
		} finally {
			signingOut = false;
		}
	};

	// #region: Icons
	import Building2Icon from '@lucide/svelte/icons/building-2';
	import CoinsIcon from '@lucide/svelte/icons/coins';
	import HandCoinsIcon from '@lucide/svelte/icons/hand-coins';
	import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';
	import ReceiptTextIcon from '@lucide/svelte/icons/receipt-text';
	import TruckIcon from '@lucide/svelte/icons/truck';
	import FileBarChart2Icon from '@lucide/svelte/icons/file-bar-chart-2';
	import WalletIcon from '@lucide/svelte/icons/wallet';
	import TagIcon from '@lucide/svelte/icons/tag';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSideBar from '$lib/components/AppSidebar.svelte';
	// #endregion
	function isActive(href: string) {
		return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
	}

	const adminNavItems = [
		{ href: '/', label: 'Dashboard', icon: LayoutDashboardIcon },
		{ href: '/branches', label: 'Branches', icon: Building2Icon },
		{ href: '/expenses-items', label: 'Expense Items', icon: TagIcon },
		{ href: '/ramp-operations', label: 'Ramp Operations', icon: TruckIcon },
		{ href: '/expenses-float', label: 'Expenses & Float', icon: ReceiptTextIcon },
		{ href: '/mill-sales', label: 'Mill Sales', icon: FileBarChart2Icon },
		{ href: '/main-company-advances', label: 'Advances from D&B', icon: CoinsIcon },
		{ href: '/branch-advances-allocated', label: 'Branch Advances', icon: HandCoinsIcon },
		{ href: '/reports', label: 'Reports', icon: WalletIcon }
	] as const;
</script>

<!-- <svelte:head><link rel="icon" href={favicon} /></svelte:head> -->

<Toaster richColors position="top-right" />

<Sidebar.Provider>
	<AppSideBar />
	<Sidebar.Inset>
		<div class="flex min-w-0 flex-1 flex-col">
			<header class="sticky top-0 z-30 border-b bg-background">
				<div class="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
					<div class="flex items-center gap-3">
						<Sheet.Root bind:open={mobileNavOpen}>
							<Sheet.Trigger>
								{#snippet child({ props })}
									<Button
										variant="outline"
										size="icon-sm"
										class="lg:hidden"
										aria-label="Open navigation"
										{...props}
									>
										<MenuIcon class="size-4" />
									</Button>
								{/snippet}
							</Sheet.Trigger>
							<Sheet.Content side="left" class="p-0">
								<div class="border-b px-6 py-5">
									<p class="text-lg font-semibold">Jengka Oil Palm</p>
									<p class="mt-1 text-sm text-muted-foreground">Agribusiness administration</p>
								</div>
								<nav class="space-y-1 px-4 py-4">
									{#each adminNavItems as item}
										<a
											href={item.href}
											class:border-l-primary={isActive(item.href)}
											class:bg-accent={isActive(item.href)}
											class:text-accent-foreground={isActive(item.href)}
											class="flex items-center gap-3 rounded-lg border-l-2 border-l-transparent px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
											onclick={() => (mobileNavOpen = false)}
										>
											<item.icon class="size-4" />
											<span>{item.label}</span>
										</a>
									{/each}
								</nav>
							</Sheet.Content>
						</Sheet.Root>

						<div>
							<!-- <p class="text-sm font-semibold">Operational workspace</p>
						<p class="hidden text-sm text-muted-foreground sm:block">
							Manage branches, advances, purchases, sales, and expenses
						</p> -->
						</div>
					</div>

					<div class="flex items-center gap-3">
						<div class="hidden text-right sm:block">
							<p class="text-sm font-medium">
								{data.user?.name ?? data.user?.email ?? 'Signed in'}
							</p>
							<p class="text-xs text-muted-foreground">Authenticated session</p>
						</div>
						<Button variant="outline" size="sm" disabled={signingOut} onclick={handleSignOut}>
							<LogOutIcon class="size-4" />
							{signingOut ? 'Signing out...' : 'Logout'}
						</Button>
					</div>
				</div>
			</header>

			<main class="flex-1 p-4 sm:p-6">
				<div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
					{@render children()}
				</div>
			</main>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>

<!-- <div class="min-h-screen bg-muted/30">
	<div class="flex min-h-screen">
		<aside class="hidden w-72 border-r bg-background lg:flex lg:flex-col">
			<div class="border-b px-6 py-5">
				<p class="text-lg font-semibold">DnB Trading</p>
			</div>

			<nav class="flex-1 space-y-1 px-4 py-4">
				{#each adminNavItems as item}
					<a
						href={item.href}
						class:border-l-primary={isActive(item.href)}
						class:bg-accent={isActive(item.href)}
						class:text-accent-foreground={isActive(item.href)}
						class="flex items-center gap-3 rounded-lg border-l-2 border-l-transparent px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
					>
						<item.icon class="size-4" />
						<span>{item.label}</span>
					</a>
				{/each}
			</nav>
		</aside>

		<div class="flex min-w-0 flex-1 flex-col">
			<header class="sticky top-0 z-30 border-b bg-background">
				<div class="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
					<div class="flex items-center gap-3">
						<Sheet.Root bind:open={mobileNavOpen}>
							<Sheet.Trigger>
								{#snippet child({ props })}
									<Button
										variant="outline"
										size="icon-sm"
										class="lg:hidden"
										aria-label="Open navigation"
										{...props}
									>
										<MenuIcon class="size-4" />
									</Button>
								{/snippet}
							</Sheet.Trigger>
							<Sheet.Content side="left" class="p-0">
								<div class="border-b px-6 py-5">
									<p class="text-lg font-semibold">Jengka Oil Palm</p>
									<p class="mt-1 text-sm text-muted-foreground">Agribusiness administration</p>
								</div>
								<nav class="space-y-1 px-4 py-4">
									{#each adminNavItems as item}
										<a
											href={item.href}
											class:border-l-primary={isActive(item.href)}
											class:bg-accent={isActive(item.href)}
											class:text-accent-foreground={isActive(item.href)}
											class="flex items-center gap-3 rounded-lg border-l-2 border-l-transparent px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
											onclick={() => (mobileNavOpen = false)}
										>
											<item.icon class="size-4" />
											<span>{item.label}</span>
										</a>
									{/each}
								</nav>
							</Sheet.Content>
						</Sheet.Root>

						<div>

						</div>
					</div>

					<div class="flex items-center gap-3">
						<div class="hidden text-right sm:block">
							<p class="text-sm font-medium">
								{data.user?.name ?? data.user?.email ?? 'Signed in'}
							</p>
							<p class="text-xs text-muted-foreground">Authenticated session</p>
						</div>
						<Button variant="outline" size="sm" disabled={signingOut} onclick={handleSignOut}>
							<LogOutIcon class="size-4" />
							{signingOut ? 'Signing out...' : 'Logout'}
						</Button>
					</div>
				</div>
			</header>

			<main class="flex-1 p-4 sm:p-6">
				<div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
					{@render children()}
				</div>
			</main>
		</div>
	</div>
</div> -->
