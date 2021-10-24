<script>
    import {
        TextField,
        Button,
        Icon,
        ProgressCircular
    } from 'svelte-materialify'
    import { onMount } from 'svelte'
    import { mdiPlus, mdiHome } from '@mdi/js'
    export let params = {}
    let exists = true
    let { party } = params
    let songs = []
    let loading = false
    onMount(async () => {
        if (party) {
            let response = await fetch(`/exists?p=${party}`)
            exists = await response.json()
        }
    })
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
    {#if exists}
        <TextField outlined on:input={debounce((event) => search(event))}
            >Search for a Song</TextField
        >
        <div class="songs d-flex justify-center flex-column">
            {#if loading}
                <ProgressCircular indeterminate />
            {:else}
                {#each songs as song}
                    <div class="song">
                        <img
                            src={song.image}
                            alt={song.name}
                            class="song-image"
                        />
                        <div class="song-info">
                            <div class="song-name">{song.name}</div>
                            <div class="song-artist">{song.artist}</div>
                            <Button on:click={() => addSong(song)}>
                                <Icon path={mdiPlus} />add
                            </Button>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    {:else}
        <div class="d-flex justify-center">
            <div class="d-flex flex-column">
                <div class="d-flex justify-center mt-16">
                    <h5>Party not found</h5>
                </div>
                <div class="d-flex justify-center">
                    <Button on:click={() => (window.location.href = '/')}>
                        <Icon path={mdiHome} />
                        Home
                    </Button>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .songs {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 80vw;
        gap: 16px;
    }
    .song {
        height: 80vw;
        width: 80vw;
        position: relative;
    }
    .song-image {
        width: 100%;
        height: 100%;
    }
    .song-info {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.8);
    }
</style>
