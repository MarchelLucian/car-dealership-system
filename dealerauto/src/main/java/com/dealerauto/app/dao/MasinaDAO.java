package com.dealerauto.app.dao;

import com.dealerauto.app.model.Masina;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class MasinaDAO {

    private final String url = "jdbc:postgresql://localhost:5432/DealerAuto";
    private final String username = "postgres";
    private final String password = "parola123";

    public List<Masina> getMasiniDisponibile(int offset, int limit) {
        List<Masina> masini = new ArrayList<>();

        String sql = """
                SELECT marca_nume, model, an_fabricatie, kilometraj, pret_achizitie
                FROM masina
                WHERE stare = 'disponibila'
                ORDER BY id
                LIMIT ? OFFSET ?;
                """;

        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, limit);
            stmt.setInt(2, offset);

            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Masina m = new Masina(
                        rs.getString("marca_nume"),
                        rs.getString("model"),
                        rs.getInt("an_fabricatie"),
                        rs.getInt("kilometraj"),
                        rs.getDouble("pret_achizitie")
                );
                masini.add(m);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return masini;
    }
}
