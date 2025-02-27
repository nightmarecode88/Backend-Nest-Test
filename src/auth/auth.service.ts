import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const q = query(collection(db, 'usuarios'), where('nombre', '==', username), where('password', '==', pass));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const user = querySnapshot.docs[0].data();
      return { username: user.nombre, password: user.password, role: user.rol };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  generateToken(payload: any) {
    return this.jwtService.sign(payload);
  }

  decodeToken(token: string) {
    return this.jwtService.verify(token);
  }

  async createAdmin(data: any): Promise<any> {
    const qName = query(collection(db, 'usuarios'), where('nombre', '==', data.newAdmin));
    const qEmail = query(collection(db, 'usuarios'), where('email', '==', data.email));
    const nameExists = await getDocs(qName);
    const emailExists = await getDocs(qEmail);

    if (!nameExists.empty) {
      throw new HttpException('Nombre en uso', HttpStatus.BAD_REQUEST);
    }
    if (!emailExists.empty) {
      throw new HttpException('Email en uso', HttpStatus.BAD_REQUEST);
    }

    const newAdmin = {
      nombre: data.newAdmin,
      password: data.password,
      email: data.email,
      rol: 1, // Admin role
      cambiarPass: data.cambiarPass // Añadir el parámetro cambiarPass
    };
    const docRef = await addDoc(collection(db, 'usuarios'), newAdmin);
    return { id: docRef.id, ...newAdmin };
  }  
}
