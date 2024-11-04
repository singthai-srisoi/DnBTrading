<script>
	import { goto } from "$app/navigation"
import Button from "$components/atoms/Button.svelte"

</script>
<svelte:head>
    <title>Person</title>
</svelte:head>

<Button onClick={() => goto("/person/customer")}>Customer</Button>
<Button onClick={() => goto("/person/supplier")}>Supplier</Button>
<Button onClick={() => goto("/person/driver")}>Driver</Button>