<script lang="ts">
	import Button from "$components/atoms/Button.svelte"
	import { createEventDispatcher } from "svelte"

	const dispatch = createEventDispatcher()

	export let showModal: boolean // boolean

	let dialog: HTMLDialogElement | null

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => {
		dispatch("close")
		showModal = false
	}}
	on:click|self={() => dialog?.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<slot name="header" />
		<hr />
		<slot />
		<hr />
		<!-- svelte-ignore a11y-autofocus -->
		<Button onClick={() => dialog?.close()} classes="danger">cancel</Button>
	</div>
</dialog>

<style>
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog {
		border: none;
		min-width: 40em;
		margin: auto;
	}
	
	dialog > div {
		padding: 1em;
		
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>