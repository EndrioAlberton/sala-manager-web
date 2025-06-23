import { occupationService } from './api';

type Observer = () => void;

class ClassroomObserver {
  private observers: Observer[] = [];
  private isChecking: boolean = false;
  private lastOccupiedRooms: Set<number> = new Set();

  subscribe(observer: Observer) {
    this.observers.push(observer);
    if (!this.isChecking) {
      this.startChecking();
    }
    return () => {
      this.unsubscribe(observer);
    };
  }

  private unsubscribe(observer: Observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
    if (this.observers.length === 0) {
      this.stopChecking();
    }
  }

  private startChecking() {
    this.isChecking = true;
    this.checkOccupations();
  }

  private stopChecking() {
    this.isChecking = false;
    this.lastOccupiedRooms = new Set();
  }

  private async checkOccupations() {
    if (!this.isChecking) return;

    try {
      const now = new Date();
      const currentDate = now.getFullYear() + '-' + 
                         String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                         String(now.getDate()).padStart(2, '0');
      const currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      const occupiedRooms = await occupationService.getOccupiedRooms(currentDate, currentTime);
      const currentOccupiedRooms = new Set(occupiedRooms.map(o => o.roomId));

      // Verifica se houve mudança no estado das salas
      let hasChanges = false;
      
      // Verifica salas que ficaram ocupadas
      for (const roomId of currentOccupiedRooms) {
        if (!this.lastOccupiedRooms.has(roomId)) {
          hasChanges = true;
          break;
        }
      }

      // Verifica salas que ficaram desocupadas
      if (!hasChanges) {
        for (const roomId of this.lastOccupiedRooms) {
          if (!currentOccupiedRooms.has(roomId)) {
            hasChanges = true;
            break;
          }
        }
      }

      // Se houve mudanças, notifica os observers
      if (hasChanges) {
        this.lastOccupiedRooms = currentOccupiedRooms;
        this.notifyObservers();
      }
    } catch (error) {
      console.error('Erro ao verificar ocupações:', error);
    }

    // Agenda próxima verificação (a cada 10 segundos)
    setTimeout(() => this.checkOccupations(), 10000);
  }

  private notifyObservers() {
    this.observers.forEach(observer => observer());
  }
}

export const classroomObserver = new ClassroomObserver(); 