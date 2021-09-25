<script>
    import Head from './components/Head.svelte'
    import { MaterialApp } from 'svelte-materialify'
    import Route from 'svelte-spa-router'
    import routes from './routes'
</script>

<MaterialApp theme="dark">
    <Head />
    <Route {routes}>test</Route>
</MaterialApp>
