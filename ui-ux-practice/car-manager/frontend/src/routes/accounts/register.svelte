<script lang="ts">
	import { mutation } from '@urql/svelte';
	import SectionCreator from '$lib/atoms/miscellaneous/SectionCreator.svelte';
	import { createUser as createUserMutation } from '$lib/api/accounts/mutations.gql';

	const mutateUser = mutation({
		query: createUserMutation
	});

	let successState = false;

	let formData = {
		username: 'dip',
		email: 'email@email.com',
		password: '12345'
	};

	let errors = {
		usernameError: null,
		emailError: null,
		passwordError: null
	};

	function createUser() {
		mutateUser({
			username: formData.username,
			email: formData.email,
			password: formData.password
		}).then((res) => {
			if (res.data.createUser.__typename === 'CreateUserError') {
				errors = res.data.createUser;
				successState = false;
			} else {
				successState = true;
			}
		});
	}
</script>

<SectionCreator class="flex flex-1 items-center justify-center">
	<div>
		<h1>Register Here</h1>
		<input
			class="ring {successState ? 'ring-lime-400' : 'ring-red-500'}"
			type="text"
			bind:value={formData.username}
		/>
		<input class="ring" type="email" bind:value={formData.email} />
		<input class="ring" type="password" bind:value={formData.password} />
		<button on:click={() => createUser()}>Submit</button>
	</div>
</SectionCreator>
