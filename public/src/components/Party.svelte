<script>
    import {
        TextField,
        Button,
        Icon,
        ProgressCircular
    } from 'svelte-materialify'
    import { mdiPlus } from '@mdi/js'
    export let params = {}
    let { party } = params
    let songs = []
    let loading = false
    function debounce(func, timeout = 300) {
        let timer
        return (...args) => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                func.apply(this, args)
            }, timeout)
        }
    }
    async function search(e) {
        loading = true
        let value = e.target.value
        let response = await fetch(`/search?q=${value}&p=${party}`)
        songs = await response.json()
        loading = false
        console.log(songs)
    }
    async function addSong(song) {
        await fetch(`/addSong?p=${party}&uri=${song.uri}`)
        console.log('song added!')
    }
</script>

<div class="container">
    <TextField outlined on:input={debounce((event) => search(event))}
        >Search for a Song</TextField
    >
    <div class="songs d-flex justify-center flex-column">
        {#if loading}
            <ProgressCircular indeterminate />
        {:else}
            {#each songs as song}
                <div class="song">
                    <div class="song-name">{song.name}</div>
                    <div class="song-artist">{song.artist}</div>
                    <Button on:click={() => addSong(song)}>
                        <Icon path={mdiPlus} />add
                    </Button>
                </div>
            {/each}
        {/if}
    </div>
</div>
