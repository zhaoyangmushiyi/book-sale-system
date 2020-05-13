package com.monochrome.booksalesystem.repository;

import com.monochrome.booksalesystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends PagingAndSortingRepository<User, Long> {

    User findUserByUsername(String username);

    User findUserByIdentification(String identification);

}
