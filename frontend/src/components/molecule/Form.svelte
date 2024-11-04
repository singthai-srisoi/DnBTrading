<script lang="ts">
	import { enhance } from "$app/forms"
	import { createEventDispatcher } from "svelte"
	import Card from "./Card.svelte"

    export let action: string = ""
    export let method: string
    // export let onSubmit: ((e: SubmitEvent) => void) | (() => void) = () => {}
    export let classes: App.StyleClass = ""
    export let size: App.Size = "md"

    const dispatch = createEventDispatcher()

    const handleTravel = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            // move to next input
            e.preventDefault()
            const form = e.currentTarget as HTMLFormElement
            const ele: NodeListOf<HTMLElement> = form.querySelectorAll(`input:not([type="hidden"]), button`)
            const index = Array.from(ele).indexOf(e.target as HTMLInputElement)
            
            if (index === ele.length - 1) {
                form.requestSubmit()
                form.reset()
                ele[0].focus()
                // console.log("focusing on =>", ele[0], 0)
                return
            }
            ele[index + 1]?.focus()
            // console.log("focusing on =>", ele[index + 1], index + 1)

        }
    }

    function handleSubmit(event: Event) {
        event.preventDefault();
        dispatch("submitted");
        const form = event.currentTarget as HTMLFormElement;
        form.requestSubmit();
    }
</script>

<form {action} {method} on:submit={handleSubmit} on:keydown={handleTravel} role="presentation" use:enhance>
    <Card {classes} {size}>
        <slot />
    </Card>
</form>

<style>
form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}
</style>