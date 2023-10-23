// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { MatSnackBar } from '@angular/material/snack-bar';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent implements OnInit {
//   countryCodes: any[] = [];

//   constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

//   ngOnInit() {
//     this.http.get<any>('https://naveenkumarans.github.io/CountryCodes/codes.json')
//       .subscribe(
//         data => {
//           this.countryCodes = data.countryCodes;
//           this.populateDropdown(this.countryCodes);
//         },
//         error => {
//           console.error('Error fetching country codes:', error);
//         }
//       );
//   }

//   populateDropdown(countries: any[]) {
//     const select = document.getElementById('countryCode') as HTMLSelectElement;
//     select.innerHTML = '';
//     countries.forEach(country => {
//       const option = document.createElement('option');
//       option.value = country.dial_code;
//       option.text = `${country.name} (${country.dial_code})`;
//       select.appendChild(option);
//     });
//   }

//   openWhatsApp() {
//     const countryCode = (document.getElementById('countryCode') as HTMLSelectElement).value;
//     const phoneNumber = (document.getElementById('phoneNumber') as HTMLInputElement).value;
//     if (phoneNumber) {
//       const message = 'You are about to be redirected to WhatsApp.';
//       this.showSnackBar(message, 'Close');
//       setTimeout(() => {
//         const url = `https://wa.me/${countryCode}${phoneNumber}`;
//         window.open(url, '_blank');
//       }, 2000);
//     } else {
//       const message = 'Please enter a valid phone number.';
//       this.showSnackBar(message, 'Close');
//     }
//   }

//   showSnackBar(message: string, panelClass: string) {
//     this.snackBar.open(message, 'Close', {
//       duration: 3000,
//       panelClass: [panelClass],
//     });
//   }
// }



import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  countryCodes: any[] = [];

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private db: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.http
      .get<any>('https://naveenkumarans.github.io/CountryCodes/codes.json')
      .subscribe(
        (data) => {
          this.countryCodes = data.countryCodes;
          this.populateDropdown(this.countryCodes);
        },
        (error) => {
          console.error('Error fetching country codes:', error);
        }
      );
  }

  populateDropdown(countries: any[]) {
    const select = document.getElementById('countryCode') as HTMLSelectElement;
    select.innerHTML = '';
    countries.forEach((country) => {
      const option = document.createElement('option');
      option.value = country.dial_code;
      option.text = `${country.name} (${country.dial_code})`;
      select.appendChild(option);
    });
  }

  openWhatsApp() {
    const countryCode = (document.getElementById(
      'countryCode'
    ) as HTMLSelectElement).value;
    const phoneNumber = (document.getElementById(
      'phoneNumber'
    ) as HTMLInputElement).value;
    if (phoneNumber) {
      const message = 'You are about to be redirected to WhatsApp.';
      this.showSnackBar(message, 'Close');
      setTimeout(() => {
        const url = `https://wa.me/${countryCode}${phoneNumber}`;
        window.open(url, '_blank');
        this.saveToFirebase(countryCode, phoneNumber); // Save data to Firebase
      }, 2000);
    } else {
      const message = 'Please enter a valid phone number.';
      this.showSnackBar(message, 'Close');
    }
  }

  // saveToFirebase(countryCode: string, phoneNumber: string) {
  //   this.db
  //     .list('userChats')
  //     .push({ countryCode: countryCode, phoneNumber: phoneNumber })
  //     .then((_) => {
  //       console.log('Data saved to Firebase successfully.');
  //     })
  //     .catch((error) => {
  //       console.error('Error saving data to Firebase:', error);
  //     });
  // }


  saveToFirebase(countryCode: string, phoneNumber: string) {
    const now = new Date();
    const date = now.toLocaleDateString('en-GB');
    const time = now.toLocaleTimeString('en-US', { hour12: true });

    const data = {
      countryCode: countryCode,
      phoneNumber: phoneNumber,
      timestamp: `${date} ${time}`
    };

    this.db.list('userChats').push(data)
      .then((_) => {
        console.log('Success.');
      })
      .catch((error) => {
        console.error('Failure:', error);
      });
  }




  showSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [panelClass],
    });
  }
}
