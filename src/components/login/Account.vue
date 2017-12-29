<template>
  <div id="login" class="pt10 yui-bg-login">
      <!-- 用户名登录 -->
      <div >
      	<div class="yui-login-title">
      		{{$t('common_btn_login')}}
      	</div>
    		<div class="yui-login-box">
    			<div class="yui-login-enter row-flex layout-flex-align-center">
    				<span class="gfont gfont-person font-size-18 mh20 yui-txt-grey"></span>
    				<div class="col-flex-1 font-size-16">
    					<input type="text"
                      class="yui-login-input"
                      autocapitalize="off"
                      :placeholder="$t('account_label_usernameemailphonenumber')"
                      v-model='username'>
    				</div>
    			</div>
    			<div class="yui-login-enter row-flex layout-flex-align-center border-t">
    				<span class="gfont gfont-pwd font-size-18 mh20 yui-txt-grey"></span>
    				<div class="col-flex-1 font-size-16">
    					<input type="password"
                      class="yui-login-input"
                      :placeholder="$t('account_tip_loginpassword')"
                      v-model='password'>
    				</div>
    			</div>
    		</div>
  		  <div class="mt20 yui-whitespace-h">
  			  <button class="btn-standard btn-standard-primary btn-standard-md"
                  @click='login()'>{{$t('common_btn_login')}}</button>
  		  </div>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    login() {
      alert(this.username + " " + this.password);
    }
  }
};
</script>

