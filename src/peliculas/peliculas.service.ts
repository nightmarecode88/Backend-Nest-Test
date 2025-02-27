import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { collection, getDocs, addDoc, query, where, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

@Injectable()
export class PeliculasService {
  constructor(private httpService: HttpService) {}

  async actualizarSWAPI(): Promise<any> {
    try {
      // Obtener las películas de SWAPI
      const response = await lastValueFrom(this.httpService.get('https://swapi.dev/api/films'));
      const films = response.data.results.map(film => ({
        title: film.title,
        opening_crawl: film.opening_crawl,
        director: film.director,
        producer: film.producer,
        release_date: film.release_date,
        SWAPI: 1,
        status: 0
      }));

      // Eliminar registros existentes con SWAPI=1
      const q = query(collection(db, 'peliculas'), where('SWAPI', '==', 1));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Agregar nuevos registros
      for (const film of films) {
        await addDoc(collection(db, 'peliculas'), film);
      }

      return films;
    } catch (error) {
      throw new HttpException('Error fetching data from SWAPI or updating Firestore', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async crearPelicula(data: any): Promise<any> {
    const q = query(collection(db, 'peliculas'), where('title', '==', data.title));
    const existingSnapshot = await getDocs(q);
    
    if (!existingSnapshot.empty) {
      throw new HttpException('El título ya existe', HttpStatus.BAD_REQUEST);
    }

    const newFilm = {
      title: data.title,
      opening_crawl: data.opening_crawl || '',
      director: data.director || '',
      producer: data.producer || '',
      release_date: data.release_date || '',
      SWAPI: 0,
      status: data.status || 0,
    };
    await addDoc(collection(db, 'peliculas'), newFilm);
    return newFilm;
  }

  async editarPelicula(title: string, data: any): Promise<any> {
    const q = query(collection(db, 'peliculas'), where('title', '==', title));
    const filmSnapshot = await getDocs(q);
    
    if (filmSnapshot.empty) {
      throw new HttpException('Película no encontrada', HttpStatus.NOT_FOUND);
    }

    const filmDoc = filmSnapshot.docs[0];
    const updateData = {
      ...(data.opening_crawl !== undefined && { opening_crawl: data.opening_crawl }),
      ...(data.director !== undefined && { director: data.director }),
      ...(data.producer !== undefined && { producer: data.producer }),
      ...(data.release_date !== undefined && { release_date: data.release_date }),
      ...(data.status !== undefined && { status: data.status }),
    };
    await updateDoc(filmDoc.ref, updateData);
    return { ...filmDoc.data(), ...updateData };
  }

  async eliminarPelicula(title: string): Promise<void> {
    const q = query(collection(db, 'peliculas'), where('title', '==', title));
    const filmSnapshot = await getDocs(q);
    
    if (filmSnapshot.empty) {
      throw new HttpException('Película no encontrada', HttpStatus.NOT_FOUND);
    }
    
    const filmDoc = filmSnapshot.docs[0];
    await deleteDoc(filmDoc.ref);
  }
  

    async listadoPeliculas(): Promise<any[]> {
        const q = query(collection(db, 'peliculas'), where('status', '==', 0));
        const querySnapshot = await getDocs(q);
        const peliculas = querySnapshot.docs.map(doc => ({
        title: doc.data().title,
        release_date: doc.data().release_date
        }));
        return peliculas;
    }

    async detallePelicula(title: string): Promise<any> {
        const q = query(collection(db, 'peliculas'), where('title', '==', title), where('status', '==', 0));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          throw new HttpException('Película no encontrada o inactiva', HttpStatus.NOT_FOUND);
        }
        const pelicula = querySnapshot.docs[0].data();
        const { SWAPI, status, ...details } = pelicula;
        return details;
      }
  

}
