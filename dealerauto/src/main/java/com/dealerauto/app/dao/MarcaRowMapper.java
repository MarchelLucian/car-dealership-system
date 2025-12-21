package com.dealerauto.app.dao;

import com.dealerauto.app.model.Marca;
import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;

public class MarcaRowMapper implements RowMapper<Marca> {

    @Override
    public Marca mapRow(ResultSet rs, int rowNum) throws SQLException {

        Marca m = new Marca();
        m.setId(rs.getInt("id"));
        m.setNume(rs.getString("nume"));
        m.setTaraOrigine(rs.getString("tara_origine"));

        return m;
    }
}
