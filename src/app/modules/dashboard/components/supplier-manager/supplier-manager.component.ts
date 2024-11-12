import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupplierEvaluationComponent } from '../supplier-evaluation/supplier-evaluation.component';

interface Supplier {
  name: string;
  nit: string;
  type: string;
  category: string;
  predecessor: string;
  evaluate: string;
}

interface Evaluation {
  executor: string;
  date: string;
  rating: number;
  predecessor: string;
  supplier: string;
}

@Component({
  selector: 'app-supplier-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Importing FormsModule for ngModel
  templateUrl: './supplier-manager.component.html',
  styleUrls: ['./supplier-manager.component.scss']
})
export class SupplierManagerComponent implements OnInit {
  supplierInput: string = '';
  supplierInfo: Supplier | null = null;
  evaluations: Evaluation[] = [];
  statusMessage: string = '';
  

  constructor(private router: Router) {}

  ngOnInit(): void {
    //this.updateStatus('SupplierManager initialized. Start typing to search for a supplier.');
  }
  goToSupplierEvaluation() {
    if (this.supplierInfo) {
      this.router.navigate(['/supplier-evaluation'], {
        queryParams: {
          name: this.supplierInfo.name,
          nit: this.supplierInfo.nit,
          type: this.supplierInfo.type,
          category: this.supplierInfo.category,
          predecessor: this.supplierInfo.predecessor
        }
      });
    }
  }
 
  searchSupplier(): void {
    const searchTerm = this.supplierInput.toLowerCase().trim();
    this.updateStatus(`Searching for: ${searchTerm}`);

    
    // Mock data - replace with actual API call in a real application
    const suppliers: Supplier[] = [
      {
        name: 'Sample Supplier',
        nit: '123456789',
        type: 'Type A',
        category: 'Category B',
        predecessor: 'Predecessor C',
        evaluate: 'evaluate'
      },
      {
        name: 'medium Supplier',
        nit: '1234567890',
        type: 'Type C',
        category: 'Category B',
        predecessor: 'Predecessor A',
        evaluate: 'evaluate'
      },
      {
        name: 'Another Supplier',
        nit: '987654321',
        type: 'Type B',
        category: 'Category A',
        predecessor: 'Predecessor D',
        evaluate: 'evaluate'
      }
    ];
    

    const matchedSupplier = suppliers.find(supplier =>
      supplier.name.toLowerCase().includes(searchTerm) ||
      supplier.nit.includes(searchTerm)
    );

    if (searchTerm && matchedSupplier) {
      this.updateSupplierInfo(matchedSupplier);
      this.updateEvaluations(matchedSupplier);
    } else {
      this.clearSupplierInfo();
      this.clearEvaluations();
    }
  }

  updateSupplierInfo(supplier: Supplier): void {
    this.supplierInfo = supplier;
    this.updateStatus(`Supplier info updated for: ${supplier.name}`);
  }

  updateEvaluations(supplier: Supplier): void {
    // Mock data - replace with actual API call in a real application
    this.evaluations = [
      { executor: 'Executor 1', date: '2024-03-01', rating: 4.5, predecessor: 'Pred 1', supplier: supplier.name },
      { executor: 'Executor 2', date: '2024-02-15', rating: 4.0, predecessor: 'Pred 2', supplier: supplier.name },
      { executor: 'Executor 3', date: '2024-01-30', rating: 4.8, predecessor: 'Pred 3', supplier: supplier.name },
    ];
    this.updateStatus(`Evaluations updated for: ${supplier.name}`);
  }

  clearSupplierInfo(): void {
    this.supplierInfo = null;
    this.updateStatus('Supplier info cleared');
  }

  clearEvaluations(): void {
    this.evaluations = [];
    this.updateStatus('Evaluations cleared');
  }

  updateStatus(message: string): void {
    this.statusMessage = message;
    setTimeout(() => {
      this.statusMessage = '';
    }, 3000);
  }
}
