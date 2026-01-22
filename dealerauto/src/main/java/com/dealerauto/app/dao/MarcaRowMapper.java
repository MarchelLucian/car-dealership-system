/**
 * RowMapper pentru maparea rezultatelor SQL către obiecte de tip Marca.
 * Transformă ResultSet în instanțe POJO pentru branduri auto.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
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
