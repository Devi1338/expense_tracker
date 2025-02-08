from flask import Flask, render_template, request, redirect, url_for, session
import csv
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Required for session management

# Ensure the 'data' directory exists
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

# Helper function to get user CSV file path
def get_user_file(username):
    return os.path.join(DATA_DIR, f"{username}.csv")

# Login route
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']  
        user_file = get_user_file(username)

        if os.path.exists(user_file):
            session['username'] = username
            return redirect(url_for('dashboard'))
        else:
            return "Invalid username or password"
    return render_template('login.html')

# Registration route
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']  # In a real app, hash the password
        user_file = get_user_file(username)

        if os.path.exists(user_file):
            return "Username already exists"
        else:
            # Create a new CSV file for the user
            with open(user_file, 'w', newline='') as file:
                writer = csv.writer(file)
                writer.writerow(["Date", "Category", "Amount", "Type"])
            session['username'] = username
            return redirect(url_for('dashboard'))
    return render_template('register.html')

# Dashboard route
@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('dashboard.html')

# Add expense route
@app.route('/add_expense', methods=['POST'])
def add_expense():
    if 'username' not in session:
        return redirect(url_for('login'))

    username = session['username']
    user_file = get_user_file(username)

    date = request.form['date']
    category = request.form['category']
    amount = request.form['amount']
    if(int(amount)<0):
        amount=0
    transaction_type = "Expense"  # Only expenses are added here

    # Write data to CSV
    with open(user_file, 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([date, category, amount, transaction_type])

    return redirect(url_for('dashboard'))

# Get transactions for the current user
@app.route('/get_transactions')
def get_transactions():
    if 'username' not in session:
        return redirect(url_for('login'))

    username = session['username']
    user_file = get_user_file(username)

    transactions = []
    with open(user_file, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            transactions.append(row)

    return {'transactions': transactions}

if __name__ == '__main__':
    app.run(debug=True)