import React, { useState, FormEvent, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.svg';
import { Title, Form, Repositories, Error } from './styles';
import api from '../../services/api';

// * Dados que iremos utilizar da API do GIT * //
interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  // * Variável para setar um novo repositório * //
  const [newRepo, setNewRepo] = useState('');
  // * Variável para controlar os erros no input * //
  const [inputError, setInputError] = useState('');
  // * Variável para armazenar os repositórios em local storage * //
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem(
      '@GithubExplorer:repositories',
    );
    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    }
    return [];
  });

  // * Gravando os repositório no Local Storage * //
  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  // * Função que para adicionar os repositórios * //
  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    // * Se o repositório estiver vazio * //
    if (!newRepo) {
      setInputError('Digite o autor/nome do reposiório');
      return;
    }
    // * Try que vai controlar se o repositório é válido * //
    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

      // * Adiciona o repository nos respositories * //
      setRepositories([...repositories, repository]);
      // * Apaga o input * //
      setNewRepo('');
      // * Apaga o Erro * //
      setInputError('');
    } catch (err) {
      setInputError('Erro na busca por esse repositório');
    }

    // * Adição de um novo repositório
    // * Consumir API Github
    // * Salvar novo repositório no estado
  }
  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore repositórios no Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(repository => (
          <Link
            key={repository.full_name}
            to={`/repositories/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
