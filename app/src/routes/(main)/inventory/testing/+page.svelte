<script lang="ts">
	import DriverComboBox from "../PersonComboBox.svelte";

    let driverId_: number | undefined = $state(undefined)
</script>

<DriverComboBox type="driver" bind:value={driverId_} />