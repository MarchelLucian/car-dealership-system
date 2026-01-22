/**
 * Service pentru gestionarea sistemului de favorite al clienților.
 * Coordonează adăugarea, ștergerea și sincronizarea mașinilor favorite.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.service;

import com.dealerauto.app.dao.FavoriteDAO;
import com.dealerauto.app.dao.MasinaDAO;
import com.dealerauto.app.dao.PretVanzareDAO;
import com.dealerauto.app.model.Favorite;
import com.dealerauto.app.model.Masina;
import com.dealerauto.app.model.PretVanzare;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.HashSet;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteDAO favoriteDAO;

    @Autowired
    private MasinaDAO masinaDAO;

    @Autowired
    private PretVanzareDAO pretVanzareDAO;
    /**
     * Toggle favorite: adaugă dacă nu există, șterge dacă există
     * Returns: true dacă s-a adăugat, false dacă s-a șters
     */
    @Transactional
    public boolean toggleFavorite(Integer clientId, Integer masinaId) {

        try {
            if (favoriteDAO.isFavorite(clientId, masinaId)) {

                favoriteDAO.removeFavorite(clientId, masinaId);
                return false;
            } else {

                favoriteDAO.addFavorite(clientId, masinaId);
                return true;
            }
        } catch (Exception e) {

            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Verifică dacă o mașină este la favorite
     */
    public boolean isFavorite(Integer clientId, Integer masinaId) {
        return favoriteDAO.isFavorite(clientId, masinaId);
    }

    /**
     * Găsește toate mașinile favorite ale unui client
     */
    public List<Masina> getFavoriteMasini(Integer clientId) {
        List<Integer> masinaIds = favoriteDAO.findMasinaIdsByClientId(clientId);
        List<Masina> masini = masinaDAO.findByIds(masinaIds);

        //  Actualizează prețurile cu cele din preturi_vanzare
        for (Masina masina : masini) {
            PretVanzare pretVanzare = pretVanzareDAO.findByMasinaId(masina.getId());

            if (pretVanzare != null) {
                masina.setPret(pretVanzare.getPretVanzare());
            }
        }

        return masini;
    }

    /**
     * Găsește ID-urile mașinilor favorite (pentru frontend)
     */
    public Set<Integer> getFavoriteMasinaIds(Integer clientId) {
        return new HashSet<>(favoriteDAO.findMasinaIdsByClientId(clientId));
    }

    /**
     * Numără favorite-urile unui client
     */
    public long countFavorites(Integer clientId) {
        return favoriteDAO.countByClientId(clientId);
    }

    /**
     * Găsește toate favorite-urile unui client cu data_adaugare
     */
    public List<Favorite> getFavoritesByClientId(Integer clientId) {
        return favoriteDAO.findByClientId(clientId);
    }
}