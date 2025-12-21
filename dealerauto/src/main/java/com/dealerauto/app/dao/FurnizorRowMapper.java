package com.dealerauto.app.dao;

import com.dealerauto.app.model.Furnizor;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class FurnizorRowMapper implements RowMapper<Furnizor> {

    @Override
    public Furnizor mapRow(ResultSet rs, int rowNum) throws SQLException {

        Furnizor f = new Furnizor();
        f.setId(rs.getInt("id"));
        f.setNume(rs.getString("nume"));
        f.setTipFurnizor(rs.getString("tip_furnizor"));
        f.setTelefon(rs.getString("telefon"));
        f.setCuiCnp(rs.getString("cui_cnp"));
        f.setAdresa(rs.getString("adresa"));
        f.setTara(rs.getString("tara"));

        return f;
    }
}
