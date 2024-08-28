<script lang="ts">
	import { ArrowBigDown, User as UserLucide, Ghost, Gift, Plus } from '@o7/icon/lucide';
	import { User as UserRO, Webhook } from '@o7/icon/remix';
	import { User as UserRS } from '@o7/icon/remix/solid';
	import { User as UserHeroO } from '@o7/icon/heroicons';
	import { User as UserHeroS } from '@o7/icon/heroicons/solid';
	import { Person as UserMO } from '@o7/icon/material';
	import { Person as UserMS } from '@o7/icon/material/solid';
	import ArrowUp from '@o7/icon/lucide/ArrowUp';
	import { ArrowLeft } from '@o7/icon';

	let show = $state(true);
</script>

<ArrowUp />
<ArrowLeft />
<ArrowBigDown />
<ArrowBigDown />
<ArrowBigDown />
<ArrowBigDown />
<Gift />
<Plus size={48} style="color: blue" />
<Webhook />
<div>
	<button onclick={() => (show = !show)}>Toggle Ghost</button>
	<br />
	{#if show}
		<Ghost />
	{/if}
</div>
<h1>Icon Packs</h1>
<UserLucide size={48} />
<UserRO size={48} />
<UserRS size={48} />
<UserHeroO size={48} />
<UserHeroS size={48} />
<UserMO size={48} />
<UserMS size={48} />
