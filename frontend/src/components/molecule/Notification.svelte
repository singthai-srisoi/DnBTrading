<script lang="ts">
    export let classes: App.StyleClass = "primary"
    export let title = ""
    export let message = ""

    let noti: HTMLElement | null = null
    let handleCancel = () => {
        if (!noti) return
        noti.remove()
    }
</script>

<div class="notification {classes}" bind:this={noti}>
    <div>
        <div class="title">{title}</div>
        <div class="message">{message}</div>
    </div>
    <div class="cancel" on:click={handleCancel} role="presentation">
        <span>❌</span>
    </div>
</div>

<style>
.notification {
    width: 100%;
    padding: 1rem;
    color: var(--color-menu-item);
    border: 1px solid #dadada;
    border-radius: 0 !important;
    background-color: #f9f9f9;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;

    display: flex;
    justify-content: space-between;

    & .title {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    & .message {
        font-size: 1rem;
    }

    & .cancel {
        cursor: pointer;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
    }

    &.success {
        border-color: var(--color-success-light);
        background-color: var(--color-success-super-light);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    &.danger {
        border-color: var(--color-danger-light);
        background-color: var(--color-danger-super-light);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    &.warning {
        border-color: var(--color-warning-light);
        background-color: var(--color-warning-super-light);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    &.info {
        border-color: var(--color-info-light);
        background-color: var(--color-info-super-light);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    &.primary {
        border-color: var(--color-primary-light);
        background-color: var(--color-primary-super-light);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
}
</style>