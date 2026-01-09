package com.dealerauto.app.dao;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class MasiniRetraseDAO {

    private final JdbcTemplate jdbcTemplate;

    public MasiniRetraseDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Inserează un SNAPSHOT complet al mașinii retrase
     */
    public void insert(
            String vin,
            String marcaNume,
            String model,
            int anFabricatie,
            int kilometraj,
            double pretAchizitie,
            String combustibil,
            String transmisie,
            int numarLocuri,
            int providerId,
            String providerNume,
            String motiv,
            int zileInStock
    ) {
        //  CALCUL TAXĂ STATIONARE (2% din preț achiziție)
        double taxaStationare = pretAchizitie * 0.02;

        String sql = """
            INSERT INTO masini_retrase (
                vin,
                marca_nume,
                model,
                an_fabricatie,
                kilometraj,
                pret_achizitie,
                combustibil,
                transmisie,
                numar_locuri,
                provider_id,
                provider_nume,
                motiv,
                taxa_stationare,
                zile_in_stock
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
        """;

        jdbcTemplate.update(
                sql,
                vin,
                marcaNume,
                model,
                anFabricatie,
                kilometraj,
                pretAchizitie,
                combustibil,
                transmisie,
                numarLocuri,
                providerId,
                providerNume,
                motiv,
                taxaStationare,
                zileInStock
        );
    }

}
