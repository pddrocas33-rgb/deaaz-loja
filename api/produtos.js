import { createClient } from '@supabase/supabase-supabase-js';

// A Vercel injeta estas variáveis automaticamente após a integração
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // 1. GET: Ler produtos do Supabase
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('id', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // 2. POST: Criar produto no Supabase (vindo do admin.html)
  if (req.method === 'POST') {
    const { nome, preco, categoria, letra, icone, imagem } = req.body;

    if (!nome || !preco || !categoria) {
      return res.status(400).json({ error: 'Campos obrigatórios em falta.' });
    }

    const { data, error } = await supabase
      .from('produtos')
      .insert([
        { 
          nome, 
          preco: parseFloat(preco), 
          categoria, 
          letra: letra.toUpperCase(), 
          icone: icone || 'fa-box', 
          imagem: imagem || '' 
        }
      ]);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ message: 'Produto guardado no Supabase com sucesso!', data });
  }

  return res.status(405).json({ error: 'Método não permitido' });
}