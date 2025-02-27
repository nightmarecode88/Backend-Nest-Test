import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { collection, getDocs, addDoc, query, where, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsuariosRegularesService {
  constructor(private authService: AuthService) {}

  async createUser(data: any): Promise<any> {
    const qName = query(collection(db, 'usuarios'), where('nombre', '==', data.nombre));
    const qEmail = query(collection(db, 'usuarios'), where('email', '==', data.email));
    const nameExists = await getDocs(qName);
    const emailExists = await getDocs(qEmail);
    
    if (!nameExists.empty) {
      throw new HttpException('Nombre en uso', HttpStatus.BAD_REQUEST);
    }
    if (!emailExists.empty) {
      throw new HttpException('Email en uso', HttpStatus.BAD_REQUEST);
    }

    const newUser = {
      ...data,
      rol: 0 // Regular user
    };
    const docRef = await addDoc(collection(db, 'usuarios'), newUser);
    return { id: docRef.id, ...newUser };
  }


  async deleteUser(name: string): Promise<void> {
    const q = query(collection(db, 'usuarios'), where('nombre', '==', name));
    const userSnapshot = await getDocs(q);
    if (userSnapshot.empty) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    const userDoc = userSnapshot.docs[0];
    await deleteDoc(userDoc.ref);
  }
  
  async updateUser(name: string, data: any): Promise<void> {
    const q = query(collection(db, 'usuarios'), where('nombre', '==', name));
    const userSnapshot = await getDocs(q);
    if (userSnapshot.empty) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    const userDoc = userSnapshot.docs[0];
    await updateDoc(userDoc.ref, data);
  }

  async viewUser(token: string): Promise<any> {
    const userInfo = this.authService.decodeToken(token);
    const q = query(collection(db, 'usuarios'), where('nombre', '==', userInfo.username));
    const userSnapshot = await getDocs(q);
    if (userSnapshot.empty) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    const user = userSnapshot.docs[0].data();
    return {
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
    };
  }

  async loginUser(data: any): Promise<any> {
    const q = query(collection(db, 'usuarios'), where('nombre', '==', data.nombre), where('password', '==', data.password));
    const userSnapshot = await getDocs(q);
    if (userSnapshot.empty) {
      throw new HttpException('Credenciales incorrectas', HttpStatus.UNAUTHORIZED);
    }
    const user = userSnapshot.docs[0].data();
    const payload = { username: user.nombre, email: user.email, role: user.rol };
    const token = this.authService.generateToken(payload);
    return { token };
  }
}
