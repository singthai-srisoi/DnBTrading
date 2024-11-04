<script lang="ts">
	import { goto } from "$app/navigation"
	import Button from "$components/atoms/Button.svelte"
	import Card from "$components/molecule/Card.svelte"
	import Container from "$components/molecule/Container.svelte"

    const handleClick = () => {
        goto("/login")
    }
</script>

<Container align="center">
    <Card>
        <h1>Thanks for using</h1>
        <Button onClick={handleClick}>Login</Button>
    </Card>
</Container>

<style>
    h1 {
        text-align: center;
    }
</style>
