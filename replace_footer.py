with open('app/page.tsx', 'r') as f:
    content = f.read()

old_footer = '''            <div className="border-t border-dark-border mt-12 pt-8 text-center">
              <p className="text-gray-500 text-sm font-mono">
                © 2025 SolFinder - Built with 💜 on Solana
              </p>
              <div className="flex justify-center space-x-4 mt-4 text-xs text-gray-600">
                <span>Open Source</span>
                <span>•</span>
                <span>Secure</span>
                <span>•</span>
                <span>Transparent</span>
              </div>
            </div>
          </div>
        </footer>'''

new_footer = '''          </div>

          {/* Footer */}
          <footer className="py-12 border-t border-dark-border mt-16">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-4 gap-8">
                {/* About */}
                <div>
                  <h3 className="text-lg font-bold mb-4 text-neon-purple">About SolFinder</h3>
                  <p className="text-sm text-gray-400">
                    Reclaim your SOL from unused token accounts on Solana. Fast, secure, and efficient.
                  </p>
                </div>

                {/* Legal - French */}
                <div>
                  <h3 className="text-lg font-bold mb-4 text-neon-purple">Légal 🇫🇷</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="/legal/fr/terms" className="text-gray-400 hover:text-neon-pink transition-colors">
                        Conditions Générales
                      </a>
                    </li>
                    <li>
                      <a href="/legal/fr/privacy" className="text-gray-400 hover:text-neon-pink transition-colors">
                        Confidentialité
                      </a>
                    </li>
                    <li>
                      <a href="/legal/fr/mentions" className="text-gray-400 hover:text-neon-pink transition-colors">
                        Mentions Légales
                      </a>
                    </li>
                    <li>
                      <a href="/legal/fr/risks" className="text-gray-400 hover:text-neon-pink transition-colors">
                        Avertissements
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Legal - English */}
                <div>
                  <h3 className="text-lg font-bold mb-4 text-neon-purple">Legal 🇬🇧</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="/legal/en/terms" className="text-gray-400 hover:text-neon-pink transition-colors">
                        Terms of Service
                      </a>
                    </li>
                    <li>
                      <a href="/legal/en/privacy" className="text-gray-400 hover:text-neon-pink transition-colors">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="/legal/en/risks" className="text-gray-400 hover:text-neon-pink transition-colors">
                        Risk Disclaimer
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Community */}
                <div>
                  <h3 className="text-lg font-bold mb-4 text-neon-purple">Community</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a 
                        href="https://github.com/SolFinder-project/sol-finder" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-neon-pink transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        GitHub
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://twitter.com/SolFinder_app" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-neon-pink transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        Twitter
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom */}
              <div className="mt-12 pt-8 border-t border-dark-border text-center text-sm text-gray-500">
                <p>© {new Date().getFullYear()} SolFinder. All rights reserved.</p>
                <p className="mt-2">Built on <span className="text-neon-purple">Solana</span> blockchain</p>
              </div>
            </div>
          </footer>
        </div>'''

# Remplacer
content = content.replace(old_footer, new_footer)

# Supprimer le footer en double à la fin (après ligne 390)
lines = content.split('\n')
# Garde seulement jusqu'à la ligne qui ferme HomeContent
content = '\n'.join(lines[:390])

with open('app/page.tsx', 'w') as f:
    f.write(content)

print("✅ Footer remplacé et nettoyé !")
