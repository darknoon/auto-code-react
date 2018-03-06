// Node environment

// https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
// https://astexplorer.net

import fs from 'fs';
import path from 'path';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import {parse} from 'babylon';
import * as t from '@babel/types';
import prettier from 'prettier';

const thisDir = path.dirname(__filename);
const file = `${thisDir}/userpage.canvas.js`;
const text = fs.readFileSync(file, 'utf8');

const prettierConfig = {
  semi: true,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: false,
};

const ast = parse(text, {
  sourceType: 'module',
  plugins: [
    'jsx',
    'flow',
    'doExpressions',
    'objectRestSpread',
    'decorators',
    'classProperties',
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'asyncGenerators',
    'functionBind',
    'functionSent',
    'dynamicImport',
    'numericSeparator',
    'importMeta',
    'optionalCatchBinding',
    'optionalChaining',
    'classPrivateProperties',
    'pipelineOperator',
    'nullishCoalescingOperator',
  ],
});

const prettyPrint = (ast, fn) => {
  const {code} = generate(ast, {retainLines: true});
  return prettier.format(code, prettierConfig);

  // prettier.format(text, {
  //   ...prettierConfig,
  //   parser(text, {babylon}, options) {
  //     console.log('options are', options);
  //     return ast;
  //   },
  // });
};

test('find first comment in canvas', () => {
  let found = false;
  traverse(ast, {
    // Find the "const Storyboard = ..." declaration
    VariableDeclarator(path) {
      if (t.isIdentifier(path.node.id, {name: 'Storyboard'})) {
        path.traverse({
          JSXElement(path) {
            path.traverse({
              JSXOpeningElement(path) {
                const name = path.node.name.name;
                if (name === 'Comment') {
                  found = true;
                }
              },
            });
          },
        });
      }
    },
  });
  expect(found).toBe(true);
});

test('output with no change is same as input', () => {
  const code = prettyPrint(ast);
  expect(code).toEqual(text);
});

const changeAttributeValue = (attributeNode, newValue) => {
  attributeNode.value = t.jsxExpressionContainer(t.numericLiteral(newValue));
};

test('change value of x to x+1', () => {
  traverse(ast, {
    VariableDeclarator(path) {
      if (t.isIdentifier(path.node.id, {name: 'Storyboard'})) {
        path.traverse({
          JSXOpeningElement(path) {
            const name = path.node.name.name;
            if (name === 'Comment') {
              path.traverse({
                JSXAttribute(path) {
                  const name = path.node.name.name;
                  if (name === 'x') {
                    console.log('found x attribute in');
                    let currentValue;
                    path.traverse({
                      NumericLiteral(path) {
                        currentValue = path.node.value;
                      },
                    });
                    console.log('current value is:', currentValue);
                    changeAttributeValue(path.node, currentValue + 1);
                  }
                },
              });
            }
          },
        });
      }
    },
  });

  const code = prettyPrint(ast);
  expect(code).toMatchSnapshot();
});
