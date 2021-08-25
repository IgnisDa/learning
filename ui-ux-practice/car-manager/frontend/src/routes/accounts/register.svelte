<script lang="ts">
	import { mutation } from '@urql/svelte';
	import SectionCreator from '$lib/atoms/miscellaneous/SectionCreator.svelte';

	const mutateUser = mutation({
		query: `
        mutation ($username: String!, $email: String!, $password: String!) {
          createUser(userCreateInput:{username: $username, email: $email, password: $password}) {
            id
          }
        }
        `
	});

	let formData = {
		username: 'dip',
		email: 'email@email.com',
		password: '12345'
	};

	function createUser() {
		mutateUser({
			username: formData.username,
			email: formData.email,
			password: formData.password
		}).then((res) => {
			if (res.error) {
				console.log(res.error.graphQLErrors.map((e) => e.message));
				console.log(res.error.graphQLErrors[0].message);
			}
		});
	}
</script>

<SectionCreator class="flex flex-1 items-center justify-center">
	<div>
		<h1>Register Here</h1>
		<input class="ring" type="text" bind:value={formData.username} />
		<input class="ring" type="email" bind:value={formData.email} />
		<input class="ring" type="password" bind:value={formData.password} />
		<button on:click={() => createUser()}>Submit</button>
	</div>
</SectionCreator>
