<script>
    import { Button, Icon } from 'svelte-materialify'
    import { mdiMusic } from '@mdi/js'
    function create() {
        location.href = '/login'
    }
</script>

<div class="d-flex justify-center mb-5">
    <Button class="primary-color mt-10" on:click={create}>
        <Icon path={mdiMusic} class="mr-2" />
        Create Party
    </Button>
</div>
