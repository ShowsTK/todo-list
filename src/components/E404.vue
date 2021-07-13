<!--tamplate for page with result 404 and link to main page-->
<template>
	<div>
		<h1>Page not found</h1>
		<hr>
		<router-link :to="{name: 'notes'}">Go to main page</router-link>
	</div>
</template>

<script>
	export default {
	}
</script>
