<script lang="ts">
	import { mutation } from '@urql/svelte';
	import { createUser as createUserMutation } from '$lib/api/accounts/mutations.gql';
	import SectionCreator from '$lib/atoms/miscellaneous/SectionCreator.svelte';
	import FormInput from '$lib/molecules/miscellaneous/FormInput.svelte';
	import LoadingButton from '$lib/atoms/miscellaneous/LoadingButton.svelte';
	import HeadingPart from '$lib/atoms/accounts/HeadingPart.svelte';

	const mutateUser = mutation({
		query: createUserMutation
	});

	let successState = false;

	let loading = false;

	let formData = {
		username: '',
		email: '',
		password: ''
	};

	let errors = {
		usernameError: null,
		emailError: null,
		passwordError: null,
		globalErrors: null
	};

	async function createUser() {
		loading = true;
		const res = await mutateUser({
			username: formData.username,
			email: formData.email,
			password: formData.password
		});
		loading = false;
		if (res.error) {
			// there are validation errors
			errors.globalErrors = 'Password too weak';
			successState = false;
		} else if (res.data.createUser.__typename === 'CreateUserError') {
			errors = { ...res.data.createUser };
			successState = false;
		} else {
			successState = true;
		}
	}
</script>

<svelte:head>
	<title>Register</title>
</svelte:head>

<SectionCreator class="flex-1 grid grid-cols-1 items-center justify-center md:grid-cols-30">
	<div class="flex h-full col-span-20 justify-center items-center">
		<form
			class="flex flex-col space-y-60px p-16px w-384px"
			on:submit|preventDefault={() => createUser()}
		>
			<HeadingPart>Register</HeadingPart>
			<div class="space-y-24px">
				<FormInput required name="username" bind:value={formData.username} />
				<FormInput required name="email" bind:value={formData.email} />
				<FormInput required name="password" bind:value={formData.password} />
			</div>
			<LoadingButton {loading}>Submit</LoadingButton>
		</form>
	</div>
	<div class="h-screen col-span-10 hidden md:block">
		<img src="/car.jpg" alt="Car" class="h-full object-cover object-center" />
	</div>
</SectionCreator>
