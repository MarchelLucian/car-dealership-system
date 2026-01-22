/**
 * RowMapper pentru maparea rezultatelor SQL către obiecte de tip Masina.
 * Transformă ResultSet în instanțe POJO pentru vehicule din stoc.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.dao;

import com.dealerauto.app.model.Masina;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class MasinaRowMapper implements RowMapper<Masina> {

    @Override
    public Masina mapRow(ResultSet rs, int rowNum) throws SQLException {
        Masina m = new Masina();

        m.setId(rs.getInt("id"));
        m.setMarca(rs.getString("marca_nume"));
        m.setModel(rs.getString("model"));

        m.setFurnizorId(rs.getInt("furnizor_id"));
        m.setFurnizor(rs.getString("furnizor_nume"));


        m.setAn(rs.getInt("an_fabricatie"));
        m.setKilometraj(rs.getInt("kilometraj"));

        m.setCombustibil(rs.getString("combustibil"));
        m.setTransmisie(rs.getString("transmisie"));
        m.setCuloare(rs.getString("culoare"));

        m.setPret(rs.getBigDecimal("pret_achizitie").doubleValue());

        m.setStare(rs.getString("stare"));

        m.setNumarUsi(rs.getInt("numar_usi"));
        m.setNumarLocuri(rs.getInt("numar_locuri"));

        m.setVin(rs.getString("vin")); // vine din vin_corelare

        return m;
    }
}
