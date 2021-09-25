import Home from './components/Home.svelte'
import Create from './components/Create.svelte'
import Party from './components/Party.svelte'
export default {
    '/': Home,
    '/create': Create,
    '/:party': Party,
    '*': Home
}
