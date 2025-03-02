from flask import Flask, render_template, request, redirect
import csv
from src.services.form_service import form

app = Flask(__name__)

# Reteamento de requisições


@app.route('/submit_form', methods=['POST'])
def submit_form():
    if request.method == 'POST':

        # instancia objetos importantes
        try:
            FORM = form()
        except Exception as err:
            retorno = {
                'code': 500,
                'msg': 'Erro ao interagir com os objetos importantes: '+str(err)
            }
            return retorno, 500

        # Realiza o salvamento das informações e redireciona para a pagina de agradecimento
        try:
            data = request.form.to_dict()
            FORM.write_to_csv(data)
            return redirect('/thankyou.html')
        except Exception as err:
            retorno = {
                'code': 500,
                'msg': 'Erro ao submeter o formulario: '+str(err)
            }
            return retorno, 500
    else:
        retorno = {
            'code': 404,
            'msg': 'Metodo incompatível utilizado. A requisição deve ser feita com metodo "POST".'
        }
        return retorno, 404


# Roteamento de paginas


@app.route('/')
def my_home():
    return render_template('index.html')


@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('assets/favicon.ico')


@app.route('/<string:page_name>')
def contato(page_name='.'):
    page_name = page_name.replace('.html', '')
    if page_name.endswith('.ico'):
        return app.send_static_file(f'assets/{page_name}')
    else:
        return render_template(f'{page_name}.html')


@app.route('/assets/projects_data.csv')
def get_csv():
    return app.send_static_file('assets/projects_data.csv')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001, debug=True)
