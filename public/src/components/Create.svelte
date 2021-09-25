<script>
    import { TextField, Button, Icon } from 'svelte-materialify'
    import timestring from 'timestring'
    import QrCode from 'svelte-qrcode'
    import { mdiPrinter } from '@mdi/js'
    let urlParams = new URLSearchParams(window.location.hash.split('?')[1])
    let partyId = ''
    let token = urlParams.get('token')
    let formData = {
        name: '',
        time: '',
        timeout: '',
        token
    }
    let printing = false
    let submitted = false
    async function submit() {
        let fomattedTime = timestring(formData.time)
        let response = await fetch('/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...formData, time: fomattedTime })
        })
        let data = await response.json()
        partyId = data.partyId
        submitted = true
    }
    function print() {
        printing = true
        setTimeout(() => {
            window.print()
            printing = false
        }, 1)
    }
</script>

{#if !submitted}
    <div class="d-flex justify-center container flex-column mt-16">
        <TextField
            hint="Enter a name for yor party"
            bind:value={formData.name}
            class="mb-5"
        />
        <TextField
            hint="How long should the party last"
            placeholer="1d / 2h / 4m"
            bind:value={formData.time}
            class="mb-5"
        />
        <TextField
            hint="Submission Timeout (m)"
            bind:value={formData.timeout}
            class="mb-5"
        />
        <Button class="primary-color" on:click={submit}>Create</Button>
    </div>
{:else}
    <div
        class="d-flex justify-center container flex-column mt-16 text-center printer"
    >
        {#if !printing}
            <h4>{formData.name}</h4>
            <div class="qr-border d-flex justify-center align-center">
                <QrCode
                    size={300}
                    value={`${window.location.origin}/#/${partyId}`}
                />
            </div>
            <Button on:click={print} class="color-primary"
                ><Icon path={mdiPrinter} /> Print</Button
            >
            <div class="text-caption text-darken-3">
                Save this QR code. you can print it and share it with your
                guests.
                <br />
                It will no longer be available after you close this page.
            </div>
        {:else}
            <h2>{formData.name}</h2>
            <div class="qr-border d-flex justify-center align-center">
                <QrCode
                    size={500}
                    value={`${window.location.origin}/#/${partyId}`}
                />
            </div>
        {/if}
    </div>
{/if}

<style>
    .qr-border {
        background-color: #fff;
        border-radius: 4px;
        padding: 10px;
        width: 100%;
    }
</style>
