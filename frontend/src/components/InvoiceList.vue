<template>
  <div class="invoice-list">
    <h2>Recent Sales <i class="fa fa-history"></i></h2>
    <div class="invoice-container">
      <!-- Display filtered sales -->
      <div
          v-for="(sale, index) in (sales.length ? sales : Array(10).fill({}))"
          :key="sale._id || index"
          class="invoice-card"
      >
        <template v-if="sales.length">
          <p class="customer-name">{{ sale.customer.name }}</p>
          <p class="total-price">{{ sale.total_price }} €</p>
          <p class="sale-reference">{{ sale.reference }}</p>

          <!-- Buttons for Update, Delete, and Generate Invoice -->
          <div class="card-actions">
            <button @click="updateSale(sale)" class="action-btn update-btn">
              <i class="fa fa-pencil-alt"></i>
            </button>
            <button @click="deleteSale(sale._id)" class="action-btn delete-btn">
              <i class="fa fa-trash"></i>
            </button>
            <!-- New button for generating invoice -->
            <button @click="generateInvoice(sale)" class="action-btn invoice-btn">
              <i class="fa fa-file-invoice"></i>
            </button>
          </div>
        </template>
        <template v-else>
          <p class="nothing-found">Oups, nothing found</p>
        </template>
      </div>
    </div>
  </div>
  <UpdateSaleForm
      :sale="selectedSale"
      :show="showUpdateOverlay"
      @closeOverlay="closeUpdateOverlay"
      @updateSale="handleSaleUpdate"
  />
</template>

<script>
import UpdateSaleForm from "@/components/UpdateSaleForm.vue";

export default {
  props: {
    sales: {
      type: Array,
      default: () => []
    }
  },
  data(){
    return{
      showUpdateOverlay: false,
      selectedSale: null,
    }
  },
  components: {
    UpdateSaleForm,
  },
  methods: {
    handleCustomerName(customer) {
      console.log("CUSTOMER :", customer);
    },
    // Placeholder methods for updating and deleting sales
    updateSale(sale) {
      this.selectedSale = sale;
      this.showUpdateOverlay = true;
    },
    closeUpdateOverlay() {
      this.showUpdateOverlay = false;
    },
    async deleteSale(saleId) {
      if (confirm("Are you sure you want to delete this sale?")) {
        try {
          const response = await fetch(`https://com.servhub.fr/api/sales/${saleId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            alert('Sale deleted successfully!');
            // Remove the sale from the list in the frontend
            this.sales = this.sales.filter(sale => sale._id !== saleId);
          } else {
            const errorData = await response.json();
            alert(`Error deleting sale: ${errorData.message}`);
          }
        } catch (error) {
          console.error('Error deleting sale:', error);
        }
      }
    },
    // New method to generate and send an invoice for a sale
    async getAccessToken() {
      const clientID = "AZARWGYIQ1t8j1JqA2s-3G4ttRXc-uivXrk31VcVFnuQHMADwtmhEHRaHe7F_WAgZbp5UZO7mnnvPHyM";
      const clientSecret = "ELZfZJzG29tgQBnF5bRY5u__o9Tq54KLzO1lGQcoPnAKsgsHpsCgdMcke2P5f7Z3m2QDggVgE2seU0X6";

      const credentials = btoa(`${clientID}:${clientSecret}`);
      const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials"
      });

      const data = await response.json();
      if (response.ok) {
        return data.access_token;
      } else {
        throw new Error("Unable to fetch PayPal access token");
      }
    },
    async generateInvoice(sale) {
      try {
        if (!sale.sale.products || !sale.customer) {
          console.error("Sale does not have products or customer information.", sale);
          return;
        }

        const accessToken = await this.getAccessToken();

        // Split customer address
        const addressParts = sale.customer.address.split(",");
        const addressLine1 = addressParts[0]?.trim() || "";
        const city = addressParts[1]?.trim() || "";
        const state = addressParts[2]?.trim() || "";
        const postalCode = addressParts[3]?.trim() || "";
        const country = addressParts[4]?.trim() || "CA"; // Default country is Canada (CA)

        // Fetch complete product details for each product in the sale
        const items = await Promise.all(sale.sale.products.map(async (product) => {
          console.log(product.SKU);
          const productDetails = await this.fetchProduct(product.SKU); // Fetch product details by SKU
          console.log(productDetails);
          return {
            name: productDetails.name || "Unnamed product", // Use the fetched product name
            description: productDetails.Details || "Product description",
            quantity: product.quantity || 1, // Use the sale quantity
            unit_amount: {
              currency_code: "CAD",
              value: product.price_per_unit || 0 // Use the fetched product price
            },
            tax: {
              name: "Sales Tax",
              amount: {
                currency_code: "CAD",
                value: ((product.price_per_unit * product.quantity) * 0.0725).toFixed(2) // Tax calculation
              },
              percent: "7.25" // Tax percentage
            }
          };
        }));

        // Calculate item and tax totals
        const tax_total = items.reduce((sum, product) => sum + parseFloat(product.tax.amount.value), 0).toFixed(2);
        const item_total = items.reduce((sum, product) => sum + (product.unit_amount.value * product.quantity), 0).toFixed(2);

        // Create the invoice payload
        const invoicePayload = {
          detail: {
            currency_code: "CAD",
            invoice_number: `INV-${new Date().getTime()}`,
            reference: sale.reference || `REF-${new Date().getTime()}`,
            invoice_date: new Date().toISOString().split("T")[0],
            note: "Thank you for your purchase.",
            payment_term: {
              term_type: "NO_DUE_DATE",
            },
            payment_detail: {
              type: "PAYPAL",
              transaction_id: sale.id || "sampleTransactionID",
              method: "PayPal"
            }
          },
          invoicer: {
            name: {
              given_name: "RetailHub Corporation",
              surname: "RetailHub"
            },
            address: {
              address_line_1: "777 boulevard Robert Bourassa",
              admin_area_2: "Montréal",
              admin_area_1: "Québec",
              postal_code: "H3C 3Z7",
              country_code: "CA"
            },
            email_address: "sb-qglh933109622@business.example.com"
          },
          primary_recipients: [
            {
              billing_info: {
                name: {
                  given_name: sale.customer.firstName,
                  surname: sale.customer.lastName
                },
                address: {
                  address_line_1: addressLine1,
                  admin_area_2: city,
                  admin_area_1: state,
                  postal_code: postalCode,
                  country_code: country
                },
                email_address: sale.customer.email
              }
            }
          ],
          items,
          amount: {
            breakdown: {
              item_total: {
                currency_code: "CAD",
                value: item_total // Item total calculation
              },
              tax_total: {
                currency_code: "CAD",
                value: tax_total // Tax total calculation
              }
            },
            total: {
              currency_code: "CAD",
              value: sale.total_price || (parseFloat(item_total) + parseFloat(tax_total)).toFixed(2)
            },
            paid_amount: {
              currency_code: "CAD",
              value: sale.total_price || (parseFloat(item_total) + parseFloat(tax_total)).toFixed(2) // Mark total as paid
            }
          }
        };

        // Send the request to PayPal to create the invoice
        const invoiceResponse = await fetch('https://api-m.sandbox.paypal.com/v2/invoicing/invoices', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(invoicePayload)
        });

        const invoiceResult = await invoiceResponse.json();
        console.log("Invoice created:", invoiceResult);

        if (invoiceResult.href) {
          const invoiceDetailsResponse = await fetch(invoiceResult.href, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });

          const invoiceDetails = await invoiceDetailsResponse.json();
          console.log("Invoice details:", invoiceDetails);
          const sendInvoiceResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/invoicing/invoices/${invoiceDetails.id}/send`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });
          const sendInvoiceResult = await sendInvoiceResponse.json();
          console.log("Invoice sent:", sendInvoiceResult);

          const recipientViewURL = invoiceDetails.detail.metadata.recipient_view_url;
          if (recipientViewURL) {
            window.open(recipientViewURL); // Open the invoice in a new tab
          }
        }
      } catch (error) {
        console.error("Error generating invoice:", error);
      }
    },
    async fetchProduct(SKU) {
      try {
        const response = await fetch(`https://com.servhub.fr/api/products/${SKU}`);
        if (!response.ok) {
          throw new Error(`Product with SKU: ${SKU} not found.`);
        }
        console.log(response.body);
        return await response.json(); // Return the product details
      } catch (error) {
        console.error(`Error fetching product with SKU: ${SKU}`, error);
        throw error;
      }
    },
  },
};
</script>

<style scoped>
.invoice-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  padding-bottom: 10px;
}

.invoice-card {
  min-width: 200px;
  max-width: 200px;
  height: 200px;
  padding: 10px;
  border-radius: 20px;
  background: linear-gradient(to bottom right, #aac4f6, #c2d7f4);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative; /* Make the card relative to position the buttons */
}

.customer-name {
  font-weight: bold;
  font-size: 28px;
  margin-bottom: 10px;
  margin-left: 10px;
}

.total-price {
  font-size: 24px;
  margin-left: 10px;
}

.sale-reference {
  font-size: 18px;
  color: #333;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
}

/* Action buttons (Update and Delete) */
.card-actions {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
}

.action-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.update-btn {
  color: #4caf50; /* Green color for update */
}

.delete-btn {
  color: #f44336; /* Red color for delete */
}

.action-btn:hover {
  background-color: rgba(0, 0, 0, 0.1); /* Hover effect */
}

.nothing-found {
  font-size: 18px;
  color: red;
  text-align: center;
  margin-top: 40px;
}

.invoice-btn {
  color: #3b5998; /* Blue color for generating invoice */
}

.invoice-btn:hover {
  background-color: rgba(0, 0, 255, 0.1); /* Hover effect */
}
</style>