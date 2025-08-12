import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private base = environment.apiUrl; // e.g. http://localhost:5000/api

  constructor(private http: HttpClient) {}

  // -----------------------
  // Profile
  // -----------------------
  getProfile(): Observable<any> {
    return this.http.get(`${this.base}/profile`);
  }

  /**
   * postProfile accepts either:
   * - FormData (with field 'photo' file) OR
   * - plain JSON object with photoUrl field
   */
  postProfile(data: FormData | any): Observable<any> {
    if (data instanceof FormData) {
      return this.http.post(`${this.base}/profile`, data);
    }
    return this.http.post(`${this.base}/profile`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  // -----------------------
  // Skills (category objects)
  // -----------------------
  getSkills(): Observable<any> {
    return this.http.get(`${this.base}/skills`);
  }

  postSkills(payload: any): Observable<any> {
    return this.http.post(`${this.base}/skills`, payload);
  }

  putSkills(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.base}/skills/${id}`, payload);
  }

  deleteSkills(id: string): Observable<any> {
    return this.http.delete(`${this.base}/skills/${id}`);
  }

  // -----------------------
  // Projects (supports FormData uploads)
  // -----------------------
  getProjects(): Observable<any> {
    return this.http.get(`${this.base}/projects`);
  }

  getProject(id: string): Observable<any> {
    return this.http.get(`${this.base}/projects/${id}`);
  }

  /**
   * postProject accepts FormData (photo file + fields) or JSON
   * For FormData, make sure to append 'photo' file and stringified tools/links:
   * fd.append('tools', JSON.stringify([...]));
   * fd.append('links', JSON.stringify({ demo, repo }));
   */
  postProject(data: FormData | any): Observable<any> {
    if (data instanceof FormData) {
      return this.http.post(`${this.base}/projects`, data);
    }
    return this.http.post(`${this.base}/projects`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  putProject(id: string, data: FormData | any): Observable<any> {
    if (data instanceof FormData) {
      return this.http.put(`${this.base}/projects/${id}`, data);
    }
    return this.http.put(`${this.base}/projects/${id}`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.base}/projects/${id}`);
  }

  // -----------------------
  // Experience
  // -----------------------
  getExperience(): Observable<any> {
    return this.http.get(`${this.base}/experience`);
  }

  postExperience(payload: any): Observable<any> {
    return this.http.post(`${this.base}/experience`, payload);
  }

  putExperience(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.base}/experience/${id}`, payload);
  }

  deleteExperience(id: string): Observable<any> {
    return this.http.delete(`${this.base}/experience/${id}`);
  }

  // -----------------------
  // Education
  // -----------------------
  getEducation(): Observable<any> {
    return this.http.get(`${this.base}/education`);
  }

  postEducation(payload: any): Observable<any> {
    return this.http.post(`${this.base}/education`, payload);
  }

  putEducation(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.base}/education/${id}`, payload);
  }

  deleteEducation(id: string): Observable<any> {
    return this.http.delete(`${this.base}/education/${id}`);
  }

  // -----------------------
  // Messages (contact form)
  // -----------------------
  postMessage(payload: any): Observable<any> {
    return this.http.post(`${this.base}/messages`, payload);
  }

  getMessages(): Observable<any> {
    return this.http.get(`${this.base}/messages`);
  }

  deleteMessage(id: string): Observable<any> {
    return this.http.delete(`${this.base}/messages/${id}`);
  }
}
