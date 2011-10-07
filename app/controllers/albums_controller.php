<?php

class AlbumsController extends AppController {

  var $name = 'Albums';
  var $helpers = array('Ajax', 'Js');
  var $components = array('RequestHandler');

  function beforeFilter() {
    $this->Auth->allowedActions = array('index', 'view', 'add', 'edit', 'delete');
    parent::beforeFilter();
  }

  function index() {
    $this->Album->recursive = 0;
    $this->set('albums', $this->paginate());
  }

  function view($id = null) {
    if (!$id) {
      $this->Session->setFlash(__('Invalid album', true));
    }
    $this->set('album', $this->Album->read(null, $id));
  }

  function add() {
    if (!empty($this->data)) {
      $this->Album->create();
      $this->log($this->data, LOG_DEBUG);
      if ($this->Album->save($this->data)) {
        $this->Session->setFlash(__('The album has been saved', true));
      } else {
        $this->Session->setFlash(__('The album could not be saved. Please, try again.', true));
      }
    }
    $images = $this->Album->Image->find('list');
    $galleries = $this->Album->Gallery->find('list');
    $this->set(compact('images', 'galleries'));
  }

  function edit($id = null) {
    if (!$id && empty($this->data)) {
      $this->Session->setFlash(__('Invalid album', true));
      $this->redirect(array('action' => 'index'));
    }
    if (!empty($this->data)) {
      $this->log($this->data, LOG_DEBUG);
      if ($this->Album->save($this->data)) {
        $this->Session->setFlash(__('The album has been saved', true));
        $this->redirect(array('action' => 'index'));
      } else {
        $this->Session->setFlash(__('The album could not be saved. Please, try again.', true));
      }
    }
    if (empty($this->data)) {
      $this->data = $this->Album->read(null, $id);
    }
    $images = $this->Album->Image->find('list');
    $galleries = $this->Album->Gallery->find('list');
    $this->set(compact('images', 'galleries'));
  }

  function delete($id = null) {
    if (!$id) {
      $this->Session->setFlash(__('Invalid id for album', true));
      $this->redirect(array('action' => 'index'));
    }
    if ($this->Album->delete($id)) {
      $this->Session->setFlash(__('Album deleted', true));
      $this->redirect(array('action' => 'index'));
    }
    $this->Session->setFlash(__('Album was not deleted', true));
    $this->redirect(array('action' => 'index'));
  }

}

?>