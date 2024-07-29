<script lang="ts">
	import { ArrowBigDown, Ghost, Gift, Plus } from '../../dist/lucide/index.js';
	import { Webhook } from '../../dist/remix/outline/index.js';

	let show = $state(true);
</script>

<ArrowBigDown />
<ArrowBigDown />
<ArrowBigDown />
<ArrowBigDown />
{#if show}
	<Ghost />
{/if}
<Gift />
<Plus size={48} style="color: blue" />
<Webhook />
<button onclick={() => (show = !show)}>Toggle Ghost</button>
