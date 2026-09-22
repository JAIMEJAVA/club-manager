package com.jaime.backend.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "matches")
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String rival;
    private LocalDate fecha;
    private boolean local;
    private int golesLocal;
    private int golesVisitante;

    @Enumerated(EnumType.STRING)
    private MatchStatus estado;

    public Match() {
    }

    public Match(Long id, String rival, LocalDate fecha, boolean local, int golesLocal,
            int golesVisitante, MatchStatus estado) {
        this.id = id;
        this.rival = rival;
        this.fecha = fecha;
        this.local = local;
        this.golesLocal = golesLocal;
        this.golesVisitante = golesVisitante;
        this.estado = estado;
    }

    public Long getId() {
        return id;
    }

    public String getRival() {
        return rival;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public boolean isLocal() {
        return local;
    }

    public int getGolesLocal() {
        return golesLocal;
    }

    public int getGolesVisitante() {
        return golesVisitante;
    }

    public MatchStatus getEstado() {
        return estado;
    }

    public void setRival(String rival) {
        this.rival = rival;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public void setLocal(boolean local) {
        this.local = local;
    }

    public void setGolesLocal(int golesLocal) {
        this.golesLocal = golesLocal;
    }

    public void setGolesVisitante(int golesVisitante) {
        this.golesVisitante = golesVisitante;
    }

    public void setEstado(MatchStatus estado) {
        this.estado = estado;
    }
}
