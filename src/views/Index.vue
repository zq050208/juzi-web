<template>
	<div>
        <!-- <p>这是跳转页面</p> -->
		<header-bar></header-bar>
		<side-bar></side-bar>
		<div class="main">
			<transition name="fade" mode="out-in">
				<keep-alive>
					<router-view v-if="$route.meta.keepAlive"></router-view>
				</keep-alive>
			</transition>
			<router-view v-if="!$route.meta.keepAlive"></router-view>
		</div>
	</div>
</template>

<script>
	import headerBar from '@/components/header'
	import sideBar from '@/components/sidebar'
	export default {
		data(){
			return {

				
			}
		},
	components: {
		headerBar,
		sideBar,
	},
	computed:{
		key(){
			return this.$route.path + Math.random();
		}
	},
	methods:{

	},
	mounted () {
		
	},
	created(){
		
	}
}
</script>

<style scoped lang="less">
  .main{
		width: 100%;
		height: 100vh;
		padding: 70px 0 0 200px;
		position: absolute;
		top:0;
		bottom:0;
		left:0;
		right:0;
	}
@media screen and (max-width: 750px){
  .main {
    padding: 70px 0 0 100px;
  }
}
</style>