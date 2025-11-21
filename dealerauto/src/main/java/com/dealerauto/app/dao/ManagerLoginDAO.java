package com.dealerauto.app.dao;

import com.dealerauto.app.model.Manager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ManagerLoginDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Manager findByUsername(String username) {
        String sql = "SELECT * FROM manager_login WHERE username = ?";

        return jdbcTemplate.queryForObject(sql, new Object[]{username}, (rs, rowNum) ->
                new Manager(
                        rs.getInt("id"),
                        rs.getString("username"),
                        rs.getString("password")
                )
        );
    }
}
