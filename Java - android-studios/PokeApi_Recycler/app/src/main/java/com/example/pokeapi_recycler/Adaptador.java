package com.example.pokeapi_recycler;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.List;

public class Adaptador extends RecyclerView.Adapter<Adaptador.ViewHolder>{

    Pokemones nombres[];
    List<Pokemones> listaPokemones;
    int id;
    Pokemones url[];

    public Adaptador(List<Pokemones> listaPokemones, int id) {
        this.listaPokemones = listaPokemones;
        this.id=id;

    }

    @NonNull
    @Override
    public Adaptador.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View vista = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_pokemon, parent, false);
        return new ViewHolder(vista);
    }

    @Override
    public void onBindViewHolder(@NonNull Adaptador.ViewHolder holder, int position) {
        Pokemones temporal= listaPokemones.get(position);
        holder.cargarDatos(temporal);
    }

    @Override
    public int getItemCount() {
        return listaPokemones.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        TextView nombres;
        Context contexto;
        TextView numero_pokemon;


        ImageView infoPoke;
        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            contexto= itemView.getContext();
            nombres=itemView.findViewById(R.id.nombrePokemon);
            numero_pokemon=itemView.findViewById(R.id.numero_id);
            infoPoke=itemView.findViewById(R.id.infoPokemon);
        }
        public void cargarDatos(Pokemones datos){
            nombres.setText(datos.getNombres());
            numero_pokemon.setText(String.valueOf(id));


            infoPoke.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intencion = new Intent(v.getContext(), InfoPokemon.class);
                    intencion.putExtra("urlPokemon", datos.getUrl());
                    v.getContext().startActivity(intencion);
                }
            });
        }
    }
}
