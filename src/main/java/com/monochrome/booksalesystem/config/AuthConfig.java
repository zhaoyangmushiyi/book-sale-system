package com.monochrome.booksalesystem.config;

import com.monochrome.booksalesystem.entity.User;
import com.monochrome.booksalesystem.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;

@Configuration
@EnableWebSecurity
public class AuthConfig extends WebSecurityConfigurerAdapter {

    private final UserService userService;


    public AuthConfig(UserService userService) {
        this.userService = userService;
    }

    /**
     * 重写该方法，设定用户访问权限
     * 用户身份可以访问 订单相关API
     * */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/login", "/user/register", "/user/forgetPassword", "/user/applyUnlock", "/login.html", "/v2/api-docs", "/swagger-resources/configuration/ui",
                        "/swagger-resources", "/swagger-resources/configuration/security", "/webjars/springfox-swagger-ui/*",
                        "/swagger-ui.html", "/css/*", "/fonts/*", "/images/*", "/js/*")
                .permitAll()
                .antMatchers("/user/**").hasAnyRole("user", "admin") // 需要具有ROLE_USER角色才能访问
                .antMatchers("/admin/**").hasAnyRole("admin") // 需要具有ROLE_ADMIN角色才能访问
                .anyRequest().authenticated()
                .and().formLogin()
                .loginPage("/login.html").loginProcessingUrl("/user/login")
                .usernameParameter("username")    //要认证的用户参数名，默认username
                .passwordParameter("password")    //要认证的密码参数名，默认password
                .successHandler((request, response, authentication) -> {
                    response.setContentType("application/json;charset=utf-8");
                    RequestCache cache = new HttpSessionRequestCache();
//                    SavedRequest savedRequest = cache.getRequest(request, response);
                    String username = request.getParameter("username");
                    User user = userService.findUserByUsername(username);
                    String url = "/index.html?username=" + user.getUsername() + "&role=" + user.getRole() + "&nickName=" + user.getNickName();
                    response.sendRedirect(url);
                })
                .failureHandler((httpServletRequest, httpServletResponse, e) -> {
                    String username = httpServletRequest.getParameter("username");
                    User user = userService.findUserByUsername(username);
                    String url;
                    if (user != null) {
                        //0为密码错误，1为用户不存在
                        url = "/login.html?error=" + 0;
                    } else {
                        url = "/login.html?error=" + 1;
                    }
                    httpServletResponse.sendRedirect(url);
                })
                .and().logout().permitAll()
                .and().csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
        http.csrf().disable();

    }


    // 密码加密方式
    @Bean
    public PasswordEncoder passwordEncoder(){
//        String admin = new BCryptPasswordEncoder().encode("admin");
        return new BCryptPasswordEncoder();
    }

    // 重写方法，自定义用户
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService);
    }

}