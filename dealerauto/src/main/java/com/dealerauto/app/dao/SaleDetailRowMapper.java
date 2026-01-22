package com.dealerauto.app.dao;

import com.dealerauto.app.model.SaleDetail;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class SaleDetailRowMapper implements RowMapper<SaleDetail> {
    @Override
    public SaleDetail mapRow(ResultSet rs, int rowNum) throws SQLException {
        SaleDetail sd = new SaleDetail();
        sd.setSaleId(rs.getInt("sale_id"));
        sd.setSaleDate(rs.getDate("data_vanzare").toLocalDate());
        sd.setFinalPrice(rs.getDouble("pret_final"));
        sd.setProfit(rs.getDouble("profit"));
        sd.setTransactionType(rs.getString("tip_tranzactie"));
        sd.setBrandName(rs.getString("marca_nume"));
        sd.setModel(rs.getString("model"));
        sd.setPurchasePrice(rs.getDouble("pret_achizitie"));
        sd.setDaysInStock(rs.getInt("days_in_stock"));
        sd.setClientName(rs.getString("client_name"));
        sd.setAgentName(rs.getString("agent_name"));
        sd.setProviderName(rs.getString("provider_name"));
        sd.setMarkupPercentage(rs.getDouble("markup_percentage"));
        return sd;
    }
}