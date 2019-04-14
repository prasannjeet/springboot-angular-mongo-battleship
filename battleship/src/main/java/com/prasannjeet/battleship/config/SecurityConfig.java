package com.prasannjeet.battleship.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * @author Prasannjeet <strong>Description: </strong>
 * The security configuration of the application. Hasn't been defined currently.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/*").permitAll().and().
                headers().cacheControl();

        //For Ip Filtering
        //.antMatchers("/foos/**").hasIpAddress("11.11.11.11")
//                .anyRequest().authenticated()
//                .and()
//                .formLogin().permitAll()
//                .and()
//                .csrf().disable();
    }
}