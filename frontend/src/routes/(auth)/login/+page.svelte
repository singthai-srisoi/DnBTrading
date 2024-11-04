<script lang="ts">
	import Button from "$components/atoms/Button.svelte"
	import Container from "$components/molecule/Container.svelte"
	import Form from "$components/molecule/Form.svelte"
	import PasswordInput from "$components/molecule/inputs/PasswordInput.svelte"
	import TextInput from "$components/molecule/inputs/TextInput.svelte"


</script>

<Container align="center">
    <Form method="post" action="" classes="primary" size="md">
        <h1>Login</h1>
        <TextInput label="Username" id="username-field" name="username" />
        <PasswordInput label="Password" id="password-field" name="password" />
        <Button type="submit" classes="primary">Submit</Button>
    </Form>
</Container>

<style>
    h1 {
        text-align: center;
    }
</style>
